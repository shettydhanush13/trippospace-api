const express = require('express');
const router = express.Router();

const SkillUser = require('../app/models/skillospace/user');
const SkillDiscussions = require('../app/models/skillospace/discussions');

const accountSid = 'AC1220e63355a01554295600675b52dad7';
const authToken = '755518f7a6b6a99131fd4bb1c5d9d940';
const servicesId = 'VA744845fc17abd7ed3d9e54547cf76edf';
const client = require('twilio')(accountSid, authToken);

router
	.route('/add-user')
	//to register a new user
	.post((req, res) => {
		let skillUser = new SkillUser();
		skillUser.info = req.body.info;
		skillUser.courses = req.body.courses;
		skillUser.save(
			(err, user) => (err ? res.send(err) : res.json({ success: 'user added succesfully', user: user }))
		);
	});

router
	.route('/get-user/:phone')
	//to get details of a user by phone number
	.get((req, res) => {
		let query = { 'info.phone': req.params.phone };
		SkillUser.findOne(query, (err, user) => (err ? res.send(err) : res.send(user)));
	});

router
	.route('/discussions')
	//to get details of a user by phone number
	.post((req, res) => {
		let query = { id: req.body.id };
		SkillDiscussions.updateOne(
			query,
			{ $set: req.body.data },
			(err, discussion) => (err ? res.send(err) : res.send(discussion))
		);
	});

router
	.route('/discussions/:id')
	//to get details of a user by phone number
	.get((req, res) => {
		let query = { id: req.params.id };
		SkillDiscussions.findOne(query, (err, discussion) => (err ? res.send(err) : res.send(discussion)));
	});

router.route('/send-otp').post(function(req, res){
	client.verify
		.services(servicesId)
		.verifications.create({ to: req.body.phone, channel: 'sms' })
		.then((verification) => res.send(verification.status));
});

router.route('/verify-otp').post(function(req, res){
	client.verify
		.services(servicesId)
		.verificationChecks.create({ to: req.body.phone, code: req.body.code })
		.then((verification_check) => res.send(verification_check.status));
});

module.exports = router;
