[About me](index.md) &nbsp;&nbsp;&nbsp;&nbsp; [Research](research.md) &nbsp;&nbsp;&nbsp;&nbsp; [Talks](talks.md) &nbsp;&nbsp;&nbsp;&nbsp; [Teaching](teaching.md) &nbsp;&nbsp;&nbsp;&nbsp; [Music](music.md)

------



### Cheat sheet for Linux

About softwares

- sudo apt-get upgrade (update the whole apt-get library)
- sudo apt install build-essential (install basic functions and dependencies)
- sudo apt install xxx (install the software of xxx)
- sudo apt install -f (fix the last installation)
- sudo apt upgrade xxx (upgrade the software of xxx)



### Cheat Sheet for Clusters at Rice

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

- sbatch myslurm
- watch squeue -u username