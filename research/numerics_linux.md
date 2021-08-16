---
layout: page
title: Cheat sheet for Linux commands
permalink: /research/numerics/linux
---
### Cheat sheet for Linux

- [Unix/Linux Command Cheat Sheet](https://files.fosswire.com/2007/08/fwunixref.pdf)

About softwares

- sudo apt-get upgrade (update the whole apt-get library)
- sudo apt install build-essential (install basic functions and dependencies)
- sudo apt install xxx (install the software of xxx)
- sudo apt install -f (fix the last installation)
- sudo apt upgrade xxx (upgrade the software of xxx)



### Cheat sheet for clusters at Rice

- [Documentation of NOTS at Rice](https://kb.rice.edu/108237)

Log in and copy files

- ssh username@nots.rice.edu
- scp local_file.zip username@nots.rice.edu:
- (1) sftp username@nots.rice.edu (2) put local_file.zip (3) get remote_file.zip (4) put -r local_directory (5) get -r remote_directory

Check and load modules

- module list (current loaded modules in my environment)
- module spider GCC (available modules related to GCC)
- module load GCC/9.3.0 OpenMPI/4.0.3 FFTW/3.3.8 (load related modules, e.g. GCC, OpenMPI and FFTW)
- module save (save the current environment)

Submit and monitoring jobs

- Write a slurm file, i.e. an example of [my slurm](myslurm).
- sbatch myslurm (submit the job)
- watch squeue -u username (check the job status)
