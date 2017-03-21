# Mosque 3D Render 

* This project is a THREE.js experiment. The purpose is to import a 3D model from Blender and build a Mosque building, inspired on Iranian mosques.

### installation
1. **Verify Node, NPM and Gulp**  
Make sure you have npm, Node.js and Gulp installed on your local machine.  
To install Node and npm check https://nodejs.org/en/download/  
To install Gulp check https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md  

2. **Clone this project**  
Go into the desired folder and type `git clone https://github.com/juulio/mosque-3d-render.git`

3. **Install dependencies**  
Go into the recently cloned folder, make sure there's a package.json file and type `npm install`.  
When this command is properly finished, there will be a new **node_modules** folder.

4. **Run the project**  
To run the project type `gulp`.  
The project will load the project on a web browser. Javascript files will not be minified.

5. To build the project (dist) type `gulp build`.

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