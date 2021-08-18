---
layout: page
title: Cheat sheet for Linux commands
permalink: /research/numerics/linux
---
### Cheat sheet for Linux

- [Unix/Linux Command Cheat Sheet](https://files.fosswire.com/2007/08/fwunixref.pdf)

About softwares

- `sudo apt-get upgrade` (update the whole apt-get library)
- `sudo apt install build-essential` (install basic functions and dependencies)
- `sudo apt install xxx` (install the software of xxx)
- `sudo apt install -f` (fix the last installation)
- `sudo apt upgrade xxx` (upgrade the software of xxx)



### Cheat sheet for clusters at Rice

- [Documentation of NOTS at Rice](https://kb.rice.edu/108237)

Log in and copy files

- `ssh username@nots.rice.edu`
- `scp local_file.zip username@nots.rice.edu:`
- (1) `sftp username@nots.rice.edu` (2) `put local_file.zip` (3) `get remote_file.zip` (4) `put -r local_directory` (5) `get -r remote_directory`.

Check and load modules

- `module list` (current loaded modules in my environment)
- `module spider GCC` (available modules related to GCC)
- `module load GCC/9.3.0 OpenMPI/4.0.3 FFTW/3.3.8` (load related modules, e.g. GCC, OpenMPI and FFTW)
- `module save` (save the current environment)

Submit and monitoring jobs

- Write a slurm file, i.e. an example of [my slurm](myslurm).
- `sbatch myslurm` (submit the job)
- `watch squeue -u username` (check the job status)

How to run graphical applications, e.g. Mathematica?

1. Download and run [Xming](https://sourceforge.net/projects/xming/files/Xming/6.9.0.31/Xming-6-9-0-31-setup.exe/download).
2. To connect the current bash terminal to X11 server, type `export DISPLAY=localhost:0.0`.
3. Connect the cluster through `ssh -X username@nots.rice.edu`.
4. Type `xterm` to see if there is a window opened. If yes, then it works!
5. In order to run Mathematica, we need to reserve a compute node, say "scavenge", by using `srun --pty --x11 --export=ALL --partition scavenge --nodes=1 --ntasks-per-node=1 --cpus-per-task=20 --mem-per-cpu=1500M --time=00:40:00 $SHELL`. Here `--export==ALL` means exporting the same environment to the compute note.
6. See the [reference](https://kb.rice.edu/page.php?id=108433).

Data and quotas

- \$Home: The home directory is where your sessions begin by default. Its intended use is for personal storage of data and files. Since it's not designed for I/O, jobs should not be submitted from here.
- \$PROJECTS: The project storage is intended for storing datasets, files and software that are accessible by all members of the PI group.
- \$WORK: This directory is similar to \$PROJECT, but only accessible to login nodes. Hence jobs should not be submitted from here.
- \$SHARED_SCRATCH: This is intended for reading and writing data (job I/O) on the cluster. It may also be used as a temporary location to hold files if you are over quota. To use it, you should create a directory for yourself and work with files from inside of said directory. Files here will be purged regularly, so always copy your data to other directories.
- \$TMPDIR: This is similar to \$SHARED_SCRATCH, but is designed for compute nodes. Data and files here will be purged at the end of each job.
- In short, submit jobs from and output data to \$SHARED_SCRATCH or \$PROJECT, then copy data to \$HOME, \$PROJECT or \$WORK at the end of each job. 
- NOTE: The physical paths for the above file systems are subject to change. You should always access the filesystems using environment variables, especially in job scripts.