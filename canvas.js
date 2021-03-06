const nodeHtmlToImage = require('node-html-to-image')
const path = require('path');

class Draw {

    drawFrom(params) {
        const canvas = `
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <style>
            html,
            body {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                width: 100%
            }
    
            .container {
                background-color: #FAACA8;
                background-image: linear-gradient(135deg, #e66465, #9198e5);
                font-size: 2.8rem;
                padding:0 1em;
                font-family: "Roboto", cursive, sans-serif;
                color:white;
                text-transform: capitalize;
                text-align: center;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                max-height: 628px;
                max-width: 1200px;
            }
    
        </style>
        </head>

        <body>
            <div class="container">
            ${params}
            </div>
        </body>
        </html>
       `
        // for await (const iterator of object) {

        // }
        return nodeHtmlToImage({
            encoding: 'base64',
            html: canvas,
            puppeteerArgs:{ 
                // headless:true,
                args: ['--no-sandbox'] ,
                // ignoreDefaultArgs: ['--disable-extensions'],
            },
        }).then((data) => data)
    }
}

module.exports = Draw

