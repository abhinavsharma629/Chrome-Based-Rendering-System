# Project Title
  ### Chrome-Based-Rendering-System

---
## Requirements

For development, you will only need Node.js, ReactJs and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd PROJECT_TITLE
    $ yarn install

## Configure app

Open `a/nice/path/to/a.file` then edit it with your settings. You will need:

- A setting;
- Another setting;
- One more setting;

## Running the project

    $ yarn start

## Simple build for production

    $ yarn build
    
---

## Description
  - Set up a local server: (Name Eve)
  - Read playlist.json
    - Eve should solely depend on the playlist.json for the state which is fetched from an external API / docker based application.
  - Download the assets (images and videos) read in playlist.json to the local desktop asynchronously
  - Set up communication between the front end and the back end.
  - GET /playlist.json
  - GET /resource/{creativeid} (for image or video)
  - Front end: (Name Adam)
    - Adam is a single page application
  - Communicate to the local server Eve through the APIs built
  - Play the media (image or video) dictated by the local server Eve.
  - After Adam finishes displaying all the content, Adam may ask Eve for the content to display in the next loop.
    - If Eve is short of contents it asynchronously asks to the external component for data, meanwhile Adam keeps on looping on the           cached advertisements.
    - Once new data is available on the next request the playlist on the Adam is updated.
    
   
## Future Implementation
  - Socket.IO for new data tracking when asked for.
  - Firebase for realtime updates on files for updating playlist.
