const express = require('express');
const Candidate = require('../models/candidate')
const router = express.Router();
const { jwtAuthMiddleWare, genrateToken } = require("./../jwt");
const User = require('../models/user');




const checkAdminRole = async (userID) => {
    try {
        console.log("the userId", userID)
        const user = await User.findById(userID);
        if (user.role === 'admin') {
            console.log("the00", user.name)
            return true
        }
    } catch (err) {

        return false;
    }
}
router.post('/', jwtAuthMiddleWare, async (req, resp) => {
    try {
        if (! await checkAdminRole(req.user.id)) {
            console.log("the not value")
            return resp.status(404).json({ message: 'user has not be admin' });
        }


        else {
            console.log("tyhr correct")
        }




        const data = req.body;

        const newCandidate = new Candidate(data);
        const savePerson = await newCandidate.save()
        console.log('data response')



        resp.status(200).json({ savePerson: savePerson });


    } catch (err) {
        console.log("the err", err);
        resp.status(500).json({ err })



    }

})





// router.get('/getAll', jwtAuthMiddleWare, async (req, resp) => {

//     try {

//         const data = await Candidate.find();
//         resp.status(200).json(data)

//     } catch (err) {
//         resp.status(500).json(err)
//     }

// })

router.put('/:candidateID', jwtAuthMiddleWare, async (req, resp) => {
    try {
        if (! await checkAdminRole(req.user.id))

            return resp.status(404).json({ message: 'user has not be admin' });

        const candidateID = req.params.candidateID;

        const updateCandidateData = req.body;
        console.log("the us", candidateID)
        const response = await Candidate.findByIdAndUpdate(candidateID, updateCandidateData, {
            new: true,
            runValidators: true
        })
        if (!response) {
            return resp.status(400).json({ err: 'not found' })
        }
        console.log("updated");
        resp.status(200).json(response)
    } catch (err) {
        resp.status(500).json(err)
    }




})

router.delete(':/candidateID', jwtAuthMiddleWare, async (req, resp) => {
    try {
        if (! await checkAdminRole(req.user.id)) {
            console.log("this is not true")
            return resp.status(404).json({ message: 'user has not be admin' });
        }


        const candidateID = req.params.candidateID;
        const response = await Person.findByIdAndDelete(candidateID);
        if (!response) {
            return resp.status(400).json({ err: 'NOT FOUN' })
        }
        console.log("deleted");
        resp.send(200).json(response);


    } catch (err) {
        resp.status(500).json({ err })

    }

})

router.post('/vote/:candidateID', jwtAuthMiddleWare, async (req, resp) => {
    //  No admin can vote
    // user can only vote once
  candidateID = req.params.candidateID;
    userId = req.user.id;
    console.log("the can",candidateID,userId)
    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            resp.status(400).json({ message: "candidate not find" })
        }
        const user = await User.findById(userId)
        if (!user) {
            resp.status(400).json({ message: "user not found" })
        }
        if (user.isVoted) {
            resp.status(400).json({ message: "user already done" })
        }
        if (user.role === 'admin') {
            resp.status(400).json({ message: 'user can not vote' })
        }
        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();
        user.isVoted=true;
        await user.save();
        resp.status(200).json({ message: 'vote recodred successfuly' })
    } catch (err) {
        resp.status(500).json({ err }) 
    }

});

router.get('/vote/count',async (req,resp)=>{
    try{

        const candidate=await Candidate.find().sort({voteCount:'desc'});
        const voteRecord=candidate.map((data)=>{
            return{
                party:data.party,
                vote:data.voteCount
            }
        })
        resp.status(200).json({ message: voteRecord })
    }catch(err)
    {
        resp.status(500).json({ err }) 
    }
})




module.exports = router;


