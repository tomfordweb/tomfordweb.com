---
title: Use docker to generate SQL insert statements from a CSV file
excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus.'
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Tim Neutkens
  picture: '/assets/blog/authors/tim.jpeg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
---

Importing large amounts of data directly from a CSV into your database via SQL workbench or any other visual editor can be a tedious, and very time consuming task - especially if you are connecting via ssh.

I have written a small docker image that will load the contents of your .csv and create an SQL dump. I have imported dumps from this into a postgresql database, but it should work on any SQL database.

You can view the repository and the container registry on my gitlab account. Pull requests welcome! [tomfordweb/csv-dumper](https://github.com/tomfordweb/csv-dumper).

Now, lets create a sample file to see how the container works.

```bash
mkdir csv-dumper-input
cd csv-dumper-input
echo '1, john@example.com' >> input.csv
echo '2, bob@example.com' >> input.csv
```

To process the file, run the following command.

```bash
docker run -v $(pwd):/input registry.gitlab.com/tomfordweb/csv-dumper \
    -f /input/input.csv \
    -c key,email:string \
    -t users
```

Running this command will output the following lines to your terminal

```sql
INSERT INTO "users"  (key, email) VALUES('1, john@example.com',NULL);
INSERT INTO "users"  (key, email) VALUES('2, bob@example.com',NULL);
```

In order to export this data to an SQL file, we can revise the previous command we ran as follows.

```bash
docker run -v $(pwd):/input registry.gitlab.com/tomfordweb/csv-dumper \
    -f /input/input.csv \
    -c key,email:string \
    -t users > dump.sql
```

```bash
cat dump.sql
```

Now we have a sql file that can be imported on a server.
