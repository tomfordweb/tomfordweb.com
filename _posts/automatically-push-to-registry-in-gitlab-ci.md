---
title: Automatically push to your container registry with Gitlab CI on tag push
excerpt: ''
coverImage: '/assets/blog/hello-world/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Tim Neutkens
  picture: '/assets/blog/authors/tim.jpeg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
---

In this post I will describe how to host your docker builds in your own gitlab docker registry. In addition, whenever a tag is built for the repository, a new image will be generated and pushed to the repository.

<!--more-->

## Project Setup

If integrating this into an existing proejct, you can skip this part.

We will push the docker `hello world` image to a registry in gitlab.

First, create the a new blank project on [gitlab](https://gitlab.com/projects/new#blank_project)

Your registry must be public.

Then, run these commands.

```bash
mkdir registry-hello-world
git init
git remote add origin ...
echo 'FROM hello-world' >> Dockerfile
git add Dockerfile
git status
git commit -m "add hello world"
git push -u origin master
```

## Pushing to your container registry

Now that we have a `Dockerfile`, let's create a new `.gitlab-ci.yml`

```yml
# .gitlab-ci.yml
stages:
  - push

variables:
  TAG_LATEST: $CI_REGISTRY_IMAGE:latest
  TAG_COMMIT: $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG

push to registry:
  only:
    - tags
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $TAG_COMMIT -t $TAG_LATEST .
    - docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $CI_REGISTRY
    - docker push $TAG_COMMIT
    - docker push $TAG_LATEST
```

We are adding two variables to the pipeline. `TAG_LATEST` and `TAG_COMMIT` which represent the `:latest` version of the tag. The other tag for the docker image will be the tag we create in git.

The pipeline script uses "Docker in Docker" (`dind`) image to build the current project into the two tagged versions.

Next, we login to the Gitlab regsitry for the project, this is using the runners token which will allow us to push to the container registry for the project. These are all predefined gitlab CI variables.

Finally, the `latest` and `x.x.x` tags are also pushed.

## Creating a tag in git

Now we can create a tag locally in git and push it to the repository. In my case I haven't created any tags so I will call it `1.0`

```
git tag
git tag 1.0
git push --tags
```

If you visit your `CI / CD -> Pipelines` page in gitlab, you should see your new tag building!

<img className="img-center" src="/pipeline-success-on-pushing-docker-image.png" alt="A successful pipeline after pushing a new tag to the gitlab repository"/>

## Pull your image from your container registry...anywhere!

In Gitlab, if you navigate to your container registry you should see two images created.

If you repository is private, you must authenticate with the Gitlab registry before pulling your image locally. This is perfectly normal, and I do this for several of my own projects, but working with a private repository is outside of the scope of this lesson.

```bash
docker login registry.gitlab.com
```

You should now be able to pull your image from your Gitlab docker registry and run it locally, (...or on any machine with docker installed!). No git or build tools needed! There is a copy button next to the tag name that you can click to get the registry image name.

<img className="img-center" src="/pushing-docker-image-to-gitlab-registry.png" alt="A list of recently receated docker images in the gitlab container registry" />

```bash
docker pull registry.gitlab.com/tomfordweb/registry-hello-world:latest
```

```bash
docker run registry.gitlab.com/tomfordweb/registry-hello-world:latest
```

You can view the repository for this article [here](https://gitlab.com/tomfordweb/registry-hello-world).
