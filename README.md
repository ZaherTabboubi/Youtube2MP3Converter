# YouTube2MP3 🎵
## full working website on here:
https://youtube2mp3converter-5.onrender.com

A simple web application that converts YouTube videos into MP3 files using Node.js, Express, EJS, and RapidAPI.

## 🚀 Features

- Convert YouTube videos to MP3
- Supports:
  - YouTube Video IDs
  - YouTube URLs
  - YouTube short links
- Simple and responsive interface
- Displays song title after conversion
- Provides a download link for the converted audio

## 🛠️ Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript Templates)
- HTML5
- CSS3
- Font Awesome
- RapidAPI

## 📂 Project Structure

```
YouTube2MP3/
│
├── app.js
├── package.json
├── views/
│   └── index.ejs
│
├── public/
│   └── css/
│       └── style.css
│
├── .env
└── README.md
```
## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/YouTube2MP3.git
```

2. Navigate into the project folder:

```bash
cd YouTube2MP3
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file:

```env
API_KEY=your_rapidapi_key
API_HOST=your_api_host
```

5. Start the server:

```bash
npm start
```

or using nodemon:

```bash
nodemon app.js
```

6. Open:

```
http://localhost:3000
```

## 📸 Preview

![YouTube2MP3 Preview](screenshots/preview.png)



## ⚠️ Disclaimer

This project was created for educational purposes. Please respect YouTube's terms of service and copyright rules when using it.

## 👨‍💻 Author

Zaher Tabboubi
