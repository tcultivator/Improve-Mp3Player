const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'https://tcultivator.github.io/Improve-Mp3Player',
    credentials: true
}))
app.use(cookieparser())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
})

db.connect((err) => {
    if (err) {
        console.log('error connecting to database')
    } else {
        console.log('database is connected!')
    }
})






app.post('/login', (req, res) => {
    const data = req.body;
    const query = 'SELECT * FROM accounts WHERE username = ? && password = ?'
    db.query(query, [data.username, data.password], (err, result) => {
        if (!result.length) {
            res.status(401).json({ message: 'wala error ka!' })


        }
        else {
            const getData = JSON.parse(JSON.stringify(result[0]))
            const token = jwt.sign({ userId: getData.id }, process.env.SECRET_KEY, { expiresIn: '24h' })
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000,
                secure: true
            })
            res.status(200).json({ message: 'may nakuha na data success!' })
        }
    })
})


function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(500).json({ message: 'unauthorize user!' })
    }
    else {
        const userId = jwt.verify(token, process.env.SECRET_KEY)
        console.log(userId)
        req.userId = userId
        next()
    }
}

app.post('/authenticate', authenticate, (req, res) => {
    const verifiedUserIId = req.userId;
    console.log('eto ung verify na na id', verifiedUserIId)
    const query = 'SELECT username FROM accounts WHERE id = ?'
    db.query(query, [verifiedUserIId.userId], (err, result) => {
        if (!result.length) {
            res.status(500).json({ message: 'no account Found' })
            console.log('hahahaha wala')
        }
        else {
            const username = result[0]
            console.log(username.username)
            res.status(200).json({ message: `welcome ${username.username}` })
        }
    })
})


app.post('/logout', authenticate, (req, res) => {
    const verifiedUserIId = req.userId;
    if (!verifiedUserIId) {
        res.status(500).json({ message: 'logout error , failed to authenticate ' })
    }
    else {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
            secure: true
        })
        res.status(200).json({ message: 'logout succesfully!' })
    }
})

app.post('/signup', (req, res) => {
    const userData = req.body;
    const query = 'INSERT INTO accounts (username,password) VALUES ( ? , ?)'
    db.query(query, [userData.username, userData.password], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'unsuccessfull signup!' })
        }
        else {
            res.status(200).json({ message: 'success signup!' })
        }
    })
})

app.listen(8080, () => {
    console.log('server is running!')
})
