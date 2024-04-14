const fs = require('fs');
const http = require('http');

const data = fs.readFileSync('./templates/data.json',{encoding:'utf-8'});
const htmlTemplate = fs.readFileSync('./templates/page.html',{encoding:'utf-8'});
const cardTemplate = fs.readFileSync('./templates/card.html',{encoding:'utf-8'});
const pageCss = fs.readFileSync('./templates/page.css',{encoding:'utf-8'});

const dataObj = JSON.parse(data);
const products = dataObj.products;

const allCards = products.map((elem)=>{
    let newCard = cardTemplate;
    newCard = newCard.replace('__TITLE_',elem.title);
    newCard = newCard.replace('__TITLE__',elem.title);
    newCard = newCard.replace('__Info__',elem.description);
    newCard = newCard.replace('_link_',elem.images[0]);
    return newCard; 
});



const allCardString = allCards.join(' ');

const myPage = function (){
    let page = htmlTemplate;
    page = page.replace('__PRODUCTS__CARDS__',allCardString);
    page  = page.replace('/* css */',pageCss);
    const change = products.map((elem)=>{
        let x = `<a href="#${elem.title}" class="link-hide">${elem.title}</a>`;
        return x;
    })
    page = page.replace('__TITLE__', change.join(' '));
    return page;
};


const app = http.createServer((req,res)=>{
    console.log('request recieved');
    console.log(req.url);
    res.writeHead(200,{
        'content-type' :'text/html'
    });
    res.end(myPage());
});

app.listen(4000);