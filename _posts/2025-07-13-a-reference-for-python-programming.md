---
layout: post
title: A reference for Python programming
date: 2025-07-13
modified_date: 2025-07-13
excerpt_separator: <!--more-->
---


Here is a brief guide for Python programming.
<!--more-->

**Table of contents**

* TOC 
{:toc}


## Anaconda and Conda
For scientific research, the most convenient way to use python is via the software [Anaconda](https://www.anaconda.com/), which is an open-source platform with an extensive installation of python packages and their dependency. It is built with a terminal window Anaconda Prompt and a powerful package and environment manager Conda.

Basic use of Conda (Also see this [online guide](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/index.html))
- `conda update -all` (Keep conda up to date)
- `conda update xxx` (Update a package/software)
- `conda remove xxx` (Remove a package/software)
- `conda clean --all` (Clean cache)
- `conda install xxx` (Install a package/software)
- `cd dir` (Enter a directory/folder)
- `cd /d dir` (Enter a directory/folder in a different drive)
- `conda search xxx` (See if a package/software is available for installation)
- `conda list xxx` (See if a package/software is installed)

Manage Conda environments
- `conda info --envs` (Show a list of all environments)
- `conda create --name myenv` (Create a conda environment named myenv)
- `conda create --name myclone --clone myenv` (Create a new environment myclone by copying myenv)
- `conda rename -n oldenv newenv` (Rename an environment)
- `conda activate myenv` (Activate myenv)
- `conda deactivate` (Deactivate the current environment)
- `conda activate` (Deactivate the current environment and activate the base environment)
- `conda remove --name myenv --all` (Remove myenv)
- `conda config --set auto_activate_base false` (Don't activate the base environment automatically)

Commands for Spyder (i.e. a python editor) console
- `%timeit function` (Measure the run time of a function)
- `%matplotlib inline` (Show new plots in the console)
- `%matplotlib qt` (Show new plots in new windows. Alternatively, one can set in Tools &rarr; Preferences &rarr; Ipython Console &rarr; Graphics &rarr; Graphics Backend &rarr; Backend: “automatic”)


## General tips for Python coding
Suggested naming conventions (Also see the [Style Guide for Python Code](https://peps.python.org/pep-0008/#naming-conventions))
- Package and module names: lower_case_with_underscores
- Class names: CapitalizedWords
- Function and variable names: lower_case_with_underscores
- Constant name convention: UPPER_CASE_WITH_UNDERSCORES
- Never use the characters 'l' (lowercase letter el), 'O' (uppercase letter oh), or 'I' (uppercase letter eye) as single character variable names.
- Use `scipy.constants` module rather than hardcoding well-known constants.


## Applications
### Data visualization
- Use `matplotlib` module for most data plotting.
  - Refs: [Matplotlib cheatsheet](https://matplotlib.org/cheatsheets/cheatsheets.pdf), [Choosing Colormaps in Matplotlib](https://matplotlib.org/stable/users/explain/colors/colormaps.html).
  - The default plot style is not suitable for paper writing for reasons like the font size is too small or the font doesn't match that of the main text. The simplest way to address it is to modify the default setting by writing a .mplstyle file in the matplotlib directory, e.g., "C:\(user name)\.matplotlib\stylelib\" (on Windows). Also see the official guide [Customizing Matplotlib with style sheets and rcParams](https://matplotlib.org/stable/users/explain/customizing.html). Here is my style file [mystyle.mplstyle](/blog/2025-07-13/mystyle.mplstyle).
- Use `imageio` module to create a video from many figures in the format of .gif, or .mp4 video if the `ffmpeg` backend is installed (e.g., using `pip install imageio[ffmpeg]`). Here is my example script [animation.py](/blog/2025-07-13/animation.py).