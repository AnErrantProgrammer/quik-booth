This application will create a "Photo Booth" experience within the web browser.  It is intended to be used with a greenscreen backdrop and a computer or laptop with a camera.  Anything that can act as a source for camera input to a browser will work.  This application has only been verified to work within Firefox.  Chrome requires that any site using the camera be HTTPS, this would require setting up a certificate which is NOT CURRENTLY part of the project.

Users can take several photos, select 1 or more to send then receive them as MMS messages on their phone.

This application requires both AWS S3 Storage and Twilio.  It is theoretically possible to use another storage solution but it is currently coded specifically for S3.


# Pre-Requisites

## Twilio

- Create a Twilio account at https://www.twilio.com
- You will be required to create a new application and select a phone number
- Twilio offers free credits for new users which will work for development and testing but you should upgrade before using publicly
- The Account SID and Auth Token must be set either as environment variables or directly in `config.js`
- The phone number and default message must be set directly in `config.js`

## AWS S3

- Create an AWS Account at https://aws.amazon.com/
- Create an S3 bucket (take note of the region and bucket name)
- Go to My Security Credentials and Create a New Access Key (take note of the Access Key and Secret Access Key)
- The Access Key and Secret Acess key must be set either as environment variables or directly in `config.js`
- The S3 Bucket, Region must be set directly in `config.js`

# Installation

- Run `npm install` to install dependencies
- Set configuration settings as Environment Variables or directly in the `config.js` file

Note: If setting `config.js` directly DO NOT CHECK IN TO GITHUB!!!!

# Adding Backdrops

- You may add additional backdrops within the `public/backdrops` folder
- Backdrops that are the same resolution as what the camera on the machine supports work best.


# Running the Server
- `node index`

# Usage

- Navigate to the server url http://localhost:3000
- Press left or right to change backdrops
- Press space to start the timer
- Once done select images to send by clicking on them (selected will have a green border)
- Enter the phone number youd like to send to
- Click send to Send or Nevermind to cancel