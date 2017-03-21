# Mosque 3D Render 

### Summary
This project is a THREE.js experiment. The purpose is to import a 3D model from Blender and build a Mosque building, inspired on Iranian mosques.

### Installation
1. **Verify Node, NPM and Gulp**  
Make sure you have npm, Node.js and Gulp installed on your local machine.  
To install Node and npm check https://nodejs.org/en/download/  
To install Gulp check https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md  

2. **Clone this project**  
Go into the desired folder and type `git clone https://github.com/juulio/mosque-3d-render.git`

3. **Install dependencies**  
Go into the recently cloned folder, make sure there's a **package.json** file and type `npm install`.  
When this command is properly finished, there will be a new **node_modules** folder. This folder will always be ignored by git.

### Running  the project
To run the project type `gulp`.  
Gulp will start a web server and the project will be loaded on a web browser.  
Javascript files will not be minified.


### Production build
Whenever you feel your project is ready, go into the project folder, and type `gulp build`.  
A **dist** folder will be generated. It'll have all the js files concatenated into a **main.min.js** file.

### gulpfile tasks
* **browserSync**: reloads the app on the browser.
* **gulp-useref**: concatenates referenced non-optimized js files.
* **gulp-uglify**: minifies javascript files.
* **gulp-jshint**: checks the javascript files for potential errors.
* **gulp-clean**:dist: cleans the dist production environment everytime the build task is executed.
* **watch**: watches the javascript files and reloads the browser.
* **default**: runs this task sequence in the provided order: sass, browserSync, watch.
* **build**: concatenates and minifies the javascript project files and moves them to the **dist** folder.

### gitignore
There's a .gitignore file. It avoids the following files and folders to be included on the git repository.
* the node_modules folder
* DS_Store files
* dist production folder