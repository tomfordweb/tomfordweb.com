---
title: Manage your infrastructure with Ansible in github actions
date: 2022-04-24
---

Managing your assets with Ansible is a great way to easily configure and manage services upgrades. Things will break with any app eventually, and the true benefit is not having to remember how to configure a server weeks or years after you have finished the project.

This tutorial will walk you through setting up an Ansible project in github actions, and provide a base repository to manage your server.

### Prerequisites

- Basic Linux Knowledge
- `ansible` installed locally. This is not a requirement, but it will make your life easier. You can use a [python venv](https://docs.python.org/3/library/venv.html) as well if you do not want Ansible available globally.
- A server, or some host to execute the ansible tasks on.
- A git repository. You can [fork the tutorial on github here](#).

## Create the playbook.

To begin, we will create a simple playbook, configuration, and inventory file and get everything working locally.

```
touch ansible.cfg inventory server.yml
```

Add the following content to each file.

##### `ansible.cfg`

```ini
[defaults]
inventory = inventory
host_key_checking = False
become_ask_pass = Yes
become = Yes
```

##### `inventory`

You can rename `myhostgroup` to whatever you want. This is used to add multiple hosts that will be configured the same. For example, you may have 15 servers that are in a cluster that have the same base packages.

You must enter your server ip or hostname.

In my case, I have the host `do-devbox` setup in my local hosts file, as well as in my github actions hosts file. This allows me to use my own personal server without adding the details to version control. This is probably not advised for most use cases.

```ini
[myhostgroup]
do-devbox

#alternatively
[myhostgroup]
<your-server-ip-or-hostname>
```

`server.yml`

```yaml
---
- name: Server configuration
  hosts: myhostgroup
  tasks:
    - ansible.builtin.ping:
```

You should now be able to run the playbook.

```
$: ansible-playbook server.yml

PLAY [Manage Server] *******

TASK [Gathering Facts] *******
ok: [<your-server-ip>]

TASK [ansible.builtin.ping] *******
ok: [<your-server-ip>]

PLAY RECAP ***********
<your-server-ip>                : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

You can also just run this ad-hoc via the command line.

```
$: ansible myhostgroup -m ping

<your-server-ip> | SUCCESS => {
  "ansible_facts": {
      "discovered_interpreter_python": "/usr/bin/python3"
  },
  "changed": false,
  "ping": "pong"
}

```

## Setup Ansible user

In a production environment, we want to have a user on the server that has SSH setup and their permissions locked down.

In the following tutorial, the user we will add will be called `ansible` however this can be whatever you want it to be.

First, we want to modify the `ansible.cfg` to login as our user. Add the following lines to `ansible.cfg`.

```
...yaml
remote_user: ansible
become_user: ansible
```

This will make it so when we run any Ansible command or playbook, we will login as `ansible`.

Try logging into the server, this command should hopefully fail because the user does not exist on the server yet.

```
<your-server-ip> | UNREACHABLE! => {
    "changed": false,
    "msg": "Failed to connect to the host via ssh: ansible@<your-server-key>: Permission denied (publickey,password).",
    "unreachable": true
}
```

Next, SSH to the server and add the user. Make sure the password is complex so it can't be hacked, you will likely never use it other than to setup ssh keys.

```
ssh root@<your-server-ip>
adduser ansible
# ...
su ansible
```

Great, we have our `ansible` user, so now we can create an SSH key. This is how we will authenticate with the server in workflows. You want to setup no password for any keys that we use in automated code.

```
$ ssh-keygen
```

We now need to do two things.

1. Setup ssh private key as a secret for actions.
2. Add public key to authorized keys.

### Add public key to authorized keys.

While still on the server logged in as `ansible`, add your public SSH key to `authorized_keys`. This will allow you to access the server in your action with this private key.

```bash
$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

### Setup private key as a secret in github actions.

While we haven't written any workflow code. It is easier to take care of this now. If you haven't yet, set the repository up in github.

Go to the project settings and select `Security -> Access -> Secrets`.

On the `Secrets` page, click `New Repository Secret` and add the following information.

- _Name_ `SSH_PRIVATE_KEY`
- _Value_ Cat the contents of the private ssh key that was generated (`~/.ssh/id_rsa`) and paste the contents here.

It would be a good idea to back the contents of this file up somewhere safe in case you lose it, and delete the private ssh key on the server after this.

### Setup local ssh access so we can test

Nothing will actually work yet, so lets change that.

On your local machine:

```
$ ssh-copy-id ansible@<your-server-ip>
```

Use the password we setup earlier on the server.

After successfully adding your SSH key we should be able to run the playbook as well as run ad-hoc commands using our projects' `ansible.cfg`.

```
ansible-playbook server.yml
ansible  myhostgroup -m ping
```

# Create a workflow

Now that we have our ping playbook code working locally, lets make sure everything works in our actions.

```
mkdir -p .github/actions
touch .github/actions/server.yml
```

I prefer to have a single action per playbook, but you can do whatever you want in your action: run the playbook on one host or several, add different configuration files, or execute all of your playbooks in one action.

`.github/actions/server.yml`

```yaml
name: Server Configuration
on:
  push:
    branches:
      # Add any additional branches you want to run the workflow on here..
      - "main"

jobs:
  script:
    runs-on: ubuntu-latest
    steps:
      # Installs the private SSH key so we can authenticate with the server.
      # The known host placeholder is necessary to make the action to work.
      # This is already setup on the server to accept our key.
      - name: Install SSH Key for the server
        uses: shimataro/ssh-key-action@v2
        with:
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          known_hosts: "a-placeholder"

      # Check the repo out. We need to be able to access the playbook.
      - name: Checkout the repo
        uses: actions/checkout@v2

      # NOTE: Not needed if you have the ip or hostname hardcoded in inventory.
      - name: Add secret hostname to /etc/hosts
        run: echo "${{ secrets.SERVER }} do-devbox" | sudo tee -a /etc/hosts

      # Ansible is installed on ubuntu-latest
      - name: Ansible
        run: "ansible-playbook server.yml"
```

If you chose to use the `/etc/hosts` method to hide your server address like I did. You will need to add the secret of `SERVER=<your-adddress>` to the github actions secrets for the project.

After pushing, your workflow will run automatically. We are mostly there.

## Setup `ansible` user permissions

### Attempt to escalate by upgrading the system

Lets add a task to update the packages of our server. I am running this playbook on a debian based server, so I will be using the [apt module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html).

The contents of your `server.yml` playbook should now look like this:

```
---
- name: "Manage Server"
  hosts: myhostgroup
  tasks:
    - name: Update apt cache and upgrade packages
      become: True
      apt:
        upgrade: dist
        update_cache: True
```

This will attempt to escalate and have `apt` update and attempt to upgrade the servers packages using `apt-get dist-upgrade`.
Try running the playbook (locally or in your actions now). It will fail.

```
$ ansible-playbook server.yml

PLAY [Manage Server] *******

TASK [Gathering Facts] *******
ok: [do-devbox]

TASK [Update apt cache and upgrade packages] *******
fatal: [do-devbox]: FAILED! => {"msg": "Missing sudo password"}

PLAY RECAP *******
do-devbox                  : ok=1    changed=0    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0
```

### Escalating

Ansible will ask for the sudo password when attempting to escalate permissions due to our `ansible.cfg`.

The `ansible` user is not a sudoer. In most cases, we will want to change that. You have several options for storing this and it really depends on your use case. These are ranked from most secure and best methods to worst.

1. Store your become password in a service like Vault.
2. Store your become password in an encrypted ansible vault and commit it to version control.
3. Allow `NOPASSWD` for your specific commands
4. Allow `NOPASSWD` for any command

I will be showing the two ways to use `NOPASSWD`. Keep in mind this is a tutorial. This is really hacky and you shouldn't do this in a true production environment. I don't even have this enabled in the final script.

Run `visudo` as root, and add one of the following to the bottom of the file.

```
ansible ALL=(ALL) NOPASSWD:ALL

# OR

ansible ALL=NOPASSWD: /usr/bin/apt-get*y /usr/bin/apt-cache*, /usr/bin/apt*, /bin/sh
```

The first (and second) option will make it so your `ansible` user can execute any command on your server without having their password asked. The issue with the second option is although it is more secure, it also lets `ansible` use `sh` without their password.

So getting root access is as easy as...`ansible@do-devbox sudo sh`.

# Conclusion

That is it! You should be able to run the playbook locally and update your packages on the server both locally and in your actions.
