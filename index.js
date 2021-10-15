import dotenv from 'dotenv'
dotenv.config()
// const express = require("express")
import express from 'express'
import cors from 'cors'
// const cors = require("cors")
const app = express()
const port = 3000
const router = express.Router()
// const fetch = require("node-fetch")
import fetch from 'node-fetch'

app.use(express.json())

app.use(cors())

app.get("/:ip", async(req, res) => {
	const ip = req.params.ip
	const data = await fetchIpData(ip)
	res.json(data)
})

app.listen(port, () => console.log(`App listening on port ${port}`))

const fetchIpData = async (ip) => {

	const url = `https://geo.ipify.org/api/v1?apiKey=${process.env.API_KEY}&ipAddress=${ip}`

	try {
		const dataStream = await fetch(url)
		const data = await dataStream.json()
		return data
	} catch (err) {
		return { Error: err.stack}
	}
}

router.get("/:ip", async(req,res) => {
	const ip = req.params.ip
	const data = await fetchIpData(ip)
	res.json(data)
})

router.post("/", async(req,res) => {
	const ip = req.body.ip
	const data = await fetchIpData(ip)
	res.json(data)
})
