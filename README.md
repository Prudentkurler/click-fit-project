# Click Fit

Click Fit is a fitness landing page with a small Node.js backend. The site includes training programmes, a class schedule, a live product feed, and an image upload area. It was built as a practical full-stack project using HTML, CSS, JavaScript, Express, and MySQL.

## Live site

The project is hosted on a linux ubuntu VPS and can be visited at:

[http://206.189.179.61](http://206.189.179.61)

## Main features

- Responsive fitness landing page
- Programme carousel and schedule filters
- Live REST API feed with refresh and Load more controls
- Multiple image uploads using Dropzone
- File type, file size, and upload count validation
- Express API with MySQL connectivity
- User creation through a stored procedure
- Health endpoints for the application and database

## Technologies used

The frontend uses HTML, CSS, JavaScript, jQuery, Bootstrap, Slick Carousel, AOS, and Dropzone. The backend uses Node.js, Express, Multer, MySQL, Helmet, CORS, and dotenv.

## Running the project locally

You need Node.js, npm, and MySQL installed.

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Prudentkurler/click-fit-project.git
cd click-fit-project
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=clickfit_db
```


## Database setup

The `database.sql` file creates the `clickfit_db` database, the `users` table, and the `adduser` stored procedure.

Import it with:

```bash
mysql -u root -p < database.sql
```

Make sure the database account in `.env` has permission to use `clickfit_db` and execute its stored procedure.

## Starting the application

For development with automatic restarts:

```bash
npm run dev
```

For a normal start:

```bash
npm start
```

Open `http://localhost:3000` in a browser.



## API routes

- `GET /api/health` checks whether the Express server is running.
- `GET /api/health/db` checks the MySQL connection.
- `POST /api/users` creates a user using the `adduser` stored procedure.
- `POST /api/upload` validates and saves uploaded images.

The user endpoint expects JSON in this form:

```json
{
  "email": "member@example.com",
  "password": "replace-this-value",
  "type": "member",
  "active": true
}
```


## Image uploads

The upload area accepts JPG, PNG, WEBP, and GIF images. Each file can be up to 5 MB, and a single submission can contain up to six images. Uploaded files are stored in the `upload_images` directory.



## Project structure

```text
assets/             Images and other site assets
css/                Page styles, animations, and breakpoints
js/                 Frontend modules
server/             Database and upload configuration
test/               Automated tests
database.sql        MySQL schema and stored procedure
index.html           Main page
server.js           Express application and API routes
```


