---
layout: post
title: "How to make a personal website on Github?"
author:
- Hong-Yi Zhang
---

A nice personal webpage is a great way to let other people know about you, and Github page is obviously one of the best choice. However, reading the [documentation](https://docs.github.com/en/pages) can sometimes be confusing. So in this article, I will introduce the basics about making a Github page. Without further ado, let's get started!

### Install Jekyll

Jekyll is a static site generator with built-in support for GitHub Pages and a simplified build process. Before you can use Jekyll to create a GitHub Pages site, you must [install Jekyll](https://jekyllrb.com/docs/installation/) and [set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git). As an example, you can use following commands to install Jekyll in Windows by using the Ubuntu subsystem (which can be installed by "wsl --install" in Windows PowerShell):

```bash
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-add-repository ppa:brightbox/ruby-ng
sudo apt-get update
sudo apt-get install ruby2.7 ruby2.7-dev build-essential dh-autoreconf
sudo gem update
sudo gem install jekyll bundler
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
git init REPOSITORY-NAME # Creates a new folder on your computer, initialized as a Git repository; Or reinitialize an existing one
cd REPOSITORY-NAME # Changes the working directory
```

For the theme of your website, check [Supported themes](https://pages.github.com/themes/) and pick any one that you like. In my case, I simply choose the ["minima"](https://github.com/jekyll/minima). Download the source codes of your favorite theme, and copy everything to your REPOSITORY folder. From the command line, run

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

During the process you will be required to type your username and personal access token ([the account password was no longer accepted when authenticating Git operations since Aug 13, 2021](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/)). Waiting for a few seconds, you can check your website "https//username.github.io/" online!

### Update the website and local files

You don't have to repeat all steps above when making any changes of the local files of the website. Instead, simply execute the following commands in order

```bash
git add --all
git commit -m "Comments and notations"
git push -u origin BRANCH
```

You may be asked for username and personal token every time you "git push". To store them, run

```bash
git config --global credential.helper store
```

Sometimes you modify the files online on Github repository and you need to pull changes from it for keeping local files up to date, in this case simply execute

```bash
git pull origin BRANCH
```

### Custom your websites

To make it your own webpage, modify "_config.yml" especially the "title" and "description" fields. You can also custom your own page style by modifying the template settings. As an example, here I will describe how to custom the [minima](https://github.com/jekyll/minima) theme.

#### Custom the home page

The default home page "index.md" includes the table of contents of posts, and this usually is not a formal choice for a personal website. To avoid it, in the "_layouts" folder, copy the "page.html" and rename it to "home_page.html". Through this way one can create a new class of page, which can be used as a home page. Then in the front matter of "index.md", you just need to replace the layout "home" by the new class "home_page".

#### Custom the header

Modify "_config.yml", for example

```bash
header_pages:
  - index.md # If index.md is written in "home" layout, then it will not be added to the header. 
  - research.md
  - talks.md
  - teaching.md
  - blogs.md
  - music.md
```

#### Custom the footer

Modify the "footer.html" in the folder "_includes".

#### Change the content width and line spacing of head titles

Go to "_sass">"minima">"custom-variables.scss". Add any settings to override the default ones in "initialize.scss". To increase the content width on the webpage, add

```bash
// Width of the content area
$content-width:    900px; # 1 pixel ~ 0.265 cm. You can also set the fraction, e.g. 65%.

$on-palm:          600px;
$on-laptop:        900px;
```

The default line spacing of head titles may be too large for you, and in order to decrease the spacing, one can set smaller "spacing-unit"

```bash
$spacing-unit:     15px;
```

However, smaller "spacing-unit" also push the margins and makes the display in cell phones anomalous. Alternatively, you can open "_layout.scss" and modify the ".post-content" part, e.g.

```bash
h1, h2, h3 { margin-top: $spacing-unit / 2 } # The default values is "$spacing-unit".
h4, h5, h6 { margin-top: $spacing-unit / 4 } # The default values is "$spacing-unit /2".
```

### Add plugins

Adding plugins can make your website more powerful and easier to be indexed by Google. There are [several useful plugins](https://jekyllrb.com/docs/step-by-step/10-deployment/#plugins) on almost any Jekyll site: jekyll-sitemap (Create a sitemap file to help search engines index content) and jekyll-seo-tag (Adds meta tags to help with SEO). For the "minima" theme, these plugins are installed by default.

### Read the documentation

When I first made a Github page, the documentation was confusing to me and I have spent days to figure it out. Although my introduction here is different from the documentation, I think it should be clearer and easier to follow. For advanced customization and details of the specs, however, one should still refer to the documentation of [Jekyll](https://jekyllrb.com/docs/) and [Github page](https://docs.github.com/en/pages), and the "README.md" of the site theme.