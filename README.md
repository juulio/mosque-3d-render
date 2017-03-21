# Mosque 3D Render 

* This project is a THREE.js experiment. The purpose is to import a 3D model from Blender and build a Mosque building, inspired on Iranian mosques.

### installation
1. Make sure you have npm, Node.js and Gulp installed on your local machine.  
To install Node and npm check https://nodejs.org/en/download/  
To install Gulp check https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md  

2. To clone this project: go into the desired folder and type `git clone https://github.com/juulio/mosque-3d-render.git`

3. To install all the project's dependencies, go into the project's folder and type `npm install`.  
Make sure there's a package.json file on this folder.
When this command is properly finished, there will be a new **node_modules** folder.

4. To run the project type `gulp`.
CSS and javascript will not be minified.

5. To build the project (dist) type `gulp build`.
CSS and javascript will be minified.

### gulpfile tasks
* **browserSync**: reloads the app on the browser.
* **useref**: concatenates referenced non-optimized js and css files. Uses gulpIf and uglify to minify javascript files.
* **clean**:dist: cleans the dist production environment.
* **cache**:clear: cache clear task.
* **watch**: watches the sass and javascript files and reloads the browser.
* **default**: runs this task sequence in the provided order: sass, browserSync, watch.

### gitignore
There's a .gitignore file. It avoids the following files and folders to be included on the git repository.
* the node_modules folder
* DS_Store files
* dist production folder