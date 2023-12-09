const nodeMailer=require('nodemailer');

const sendEmail=async(options)=>{
    
    const transporter=nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        service:"gmail",
        auth:{
            user:process.env.MyMail,
            pass:process.env.myPassword
        }
    })

    const mailOptions={
        from:process.env.MyMail,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions);
}

module.exports=sendEmail;