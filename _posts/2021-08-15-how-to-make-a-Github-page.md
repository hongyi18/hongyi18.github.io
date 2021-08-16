---
layout: post
title: "How to make a Github webpage?"
author:
- Hong-Yi Zhang
---

A nice personal webpage is a great way to let other people know about you, and Github page is obviously one of the best choice. However, reading the [documentation](https://docs.github.com/en/pages) can sometimes be confusing. So in this article, I will introduce the basics about making a Github page. Without further ado, let's get started!



### Install Jekyll

Jekyll is a static site generator with built-in support for GitHub Pages and a simplified build process. Before you can use Jekyll to create a GitHub Pages site, you must [install Jekyll](https://jekyllrb.com/docs/installation/) and [set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git). As an example, you can use following commands to install Jekyll in Win 10 by using the Ubuntu subsystem:

```bash
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-add-repository ppa:brightbox/ruby-ng
sudo apt-get update
sudo apt-get install ruby2.5 ruby2.5-dev build-essential dh-autoreconf
gem update
gem install jekyll bundler
```

Check the Jekyll version to see whether it's successfully installed.

```bash
jekyll -v
```

Then download the Git,

```bash
sudo apt-get install git
```

set [your username](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git) and [commit email](https://docs.github.com/en/github/setting-up-and-managing-your-github-user-account/managing-email-preferences/setting-your-commit-email-address) address in Git.



### Create a repository for your site

Now you can head over to GitHub and [create a new public repository](https://github.com/new) named *username*.github.io, where *username* is your username (or organization name) on GitHub.

Find the default branch name in your repository, which locates in "Settings" > "Branches". In my case it's called "master".



### Create your site

After having a repository on Github, we can open the Ubuntu shell and create a static website by using Jekyll. You should first navigate to the location where you want to store your site's source files, replacing *PARENT-FOLDER* with the folder you want to contain the folder for your repository.

```bash
cd PARENT-FOLDER
```

Then initialize your repository as a local Git repository, replacing *REPOSITORY-NAME* with the name of your repository.

```bash
git init REPOSITORY-NAME # Creates a new folder on your computer, initialized as a Git repository
cd REPOSITORY-NAME # Changes the working directory
```

For the theme of your website, check [Supported themes](https://pages.github.com/themes/) and pick any one that you like. In my case, I simply choose the "Minima". Download the source codes of your favorite theme, and copy everything to your REPOSITORY folder. From the command line, run

```bash
bundle install
```

Now you have all basic elements to make a website. You can [test your site locally](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll), or add and commit your work online

```bash
git add .
git commit -m 'My new webpage' # Write comments by replacing 'My new webpage'.
git remote add origin https://github.com/USER/REPOSITORY.git
```

Push the repository to Github, replacing BRANCH with the name of the branch you're working on. In my case it's "master".

```bash
git push -u origin BRANCH
```

Waiting for a few seconds, you can check your website "https//username.github.io/" online!



### Custom your websites

