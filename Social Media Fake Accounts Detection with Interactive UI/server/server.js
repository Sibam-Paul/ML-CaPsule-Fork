const express = require('express');
const cors = require('cors');
const needle = require('needle'); 
require('dotenv').config();

const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


const token = process.env.BEARER_TOKEN;
const endpointURL = "https://api.twitter.com/2/users/by?usernames="

async function getRequest() {

    const params = {
        usernames: "TwitterDev", // Edit usernames to look up
        "user.fields": "followers_count,friends_count,listed_count,favourites_count,statuses_count", // Edit optional query parameters here
        "expansions": "pinned_tweet_id"
    }

    const res = await needle('get', endpointURL, params, {
        headers: {
            "User-Agent": "v2UserLookupJS",
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        
        // FIX: Replaced deprecated 'request.post' with 'needle.post'
        const formData = { "heelo": "okay" };
        needle.post('http://localhost:8000/scoreJson', formData, { multipart: true }, function(err, httpResponse, body) {
            if (err) {
              return console.error("8000 Fail");
            }
            console.log("8000 Pass" , body);
        });

        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}

app.get('/:tagId', async (req, res) => {
      try {
          const response = await getRequest();
          console.dir(response, {
              depth: null
          });

      } catch (e) {
          console.log(e);
      }

      res.send("Request Complete, please check console");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
