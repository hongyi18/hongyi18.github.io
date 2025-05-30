---
layout: post
title: A reference for numerical techniques
date: 2025-05-30
modified_date: 2025-05-30
excerpt_separator: <!--more-->
---


Here is a brief review of numerical techniques I've used during research, including commands for using Linux and computational clusters.
<!--more-->

### Table of contents

* TOC 
{:toc}


### Linux cheat sheet
Manipulate files and directories
- `ls` (List files in the current directory)
- `cd dir` (Enter a directory/folder)
- `cd` (Go back to the home directory)
- `pwd` (Show the current directory)
- `mkdir dir` (Create a directory/folder)
- `rm file` (Delete a file)
- `rm -r dir` (Delete a directory)
- `cp file1 file_or_dir` (Copy file1 as/to file_or_dir)
- `mv file1 file_or_dir` (Move/rename file1 to file_or_dir)
- `more file` (Show some contents of file)
- `head file` (Show the first 10 lines of file)
- `tail file` (Show the last 10 lines of file)

Compression
- `gzip file` (Compress file to file.gz)
- `gzip -d file.gz` (Uncompress file.gz to file)

Manage software
- `sudo apt update` or `sudo apt upgrade` (Update the entire apt-get library)
- `sudo apt install build-essential` (Install basic functions and dependencies, almost always a good choice)
- `sudo apt install pkg` (Install pkg)
- `sudo apt install -f` (Fix the last installation)
- `sudo apt upgrade pkg` (Upgrade pkg)
- `sudo apt autoremove` and `sudo apt clean` (Clean useless dependencies and package files)
- `sudo apt-get --purge autoremove pkg` (Remove pkg and its dependencies)
- `dpkg -i pkg.deb` (Install pkg through .deb file)
- `bash xxx.sh` (Execute the shell script xxx)
- `wget website_address` (Download files from a website)

Vim shortcuts (See more commands on [Vim Cheat Sheet](https://vim.rtorr.com/))
- `:w` (Save file)
- `:q` (Quit file, fails if there are unsaved changes)
- `:q!` (Force to quit without saving changes)
- `:wq` (Save and quit)

Bash shortcuts
- ctrl+c (Stop current command)
- ctrl+a (Go to start of line)
- ctrl+e (Go to end of line)


### Workflow for computational clusters
Log in and copy files
- `ssh username@nots.rice.edu`
- `scp local_file.zip username@nots.rice.edu:` (Don't forget the colon)
- (1) `sftp username@nots.rice.edu` (2) `put local_file.zip` (3) `get remote_file.zip` (4) `put -r local_directory` (5) `get -r remote_directory`.

Check and load modules
- `module list` (Current loaded modules in my environment)
- `module spider GCC` (Available modules related to GCC)
- `module load GCC/9.3.0 OpenMPI/4.0.3 FFTW/3.3.8` (Load related modules, e.g. GCC, OpenMPI and FFTW)
- `module save` (Save the current environment)

Submit and monitoring jobs
- Write a slurm file, i.e. an example of [my slurm](/blog/2025-05-30/myslurm).
- `sbatch myslurm` (Submit the job)
- `watch squeue -u username` (Check the job status)

How to run graphical applications, e.g. Mathematica? (For reference only)
1. Download and run [Xming](https://sourceforge.net/projects/xming/files/Xming/6.9.0.31/Xming-6-9-0-31-setup.exe/download).
2. To connect the current bash terminal to X11 server, type `export DISPLAY=localhost:0.0`.
3. Connect the cluster through `ssh -X username@nots.rice.edu`.
4. Type `xterm` to see if there is a window opened. If yes, then it works!
5. In order to run Mathematica, we need to reserve a compute node, say "scavenge", by using `srun --pty --x11 --export=ALL --partition scavenge --nodes=1 --ntasks-per-node=1 --cpus-per-task=20 --mem-per-cpu=1500M --time=00:40:00 $SHELL`. Here `--export==ALL` means exporting the same environment to the compute note.

Data and quotas (For reference only)
- \\$Home: The home directory is where your sessions begin by default. Its intended use is for personal storage of data and files. Since it's not designed for I/O, jobs should not be submitted from here.
- \\$PROJECTS: The project storage is intended for storing datasets, files and software that are accessible by all members of the PI group.
- \\$WORK: This directory is similar to \\$PROJECT, but only accessible to login nodes. Hence jobs should not be submitted from here.
- \\$SHARED_SCRATCH: This is intended for reading and writing data (job I/O) on the cluster. It may also be used as a temporary location to hold files if you are over quota. To use it, you should create a directory for yourself and work with files from inside of said directory. Files here will be purged regularly, so always copy your data to other directories.
- \\$TMPDIR: This is similar to \\$SHARED_SCRATCH, but is designed for compute nodes. Data and files here will be purged at the end of each job.
- In short, submit jobs from and output data to \\$SHARED_SCRATCH or \\$PROJECT, then copy data to \\$HOME, \\$PROJECT or \\$WORK at the end of each job. 
- NOTE: The physical paths for the above file systems are subject to change. You should always access the filesystems using environment variables, especially in job scripts.