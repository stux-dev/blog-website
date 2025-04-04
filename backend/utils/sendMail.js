import Mailjet from "node-mailjet";

const mailjetClient = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
)

export default async function sendMail(to, name, otp) {
    try{
        const response = await mailjetClient.post("send", { version : "v3.1"}).request({
            Messages:[
                {
                    From: {
                        Email: "stuxdev.developer@gmail.com",
                        Name: "StuxDev"
                    },
                    To: [
                        {
                            Email: to,
                            Name: name
                        }
                    ],
                    TemplateID: parseInt(process.env.MJ_TEMPLATE_ID, 10),
                    TemplateLanguage: true,
                    Subject: " Verify Your Email – OTP",
                    Variables: {
                      otp: otp,
                      firstname: name
                    }
                }
            ]
        })

        return response.body;
        
    } catch(error) {
        console.log("Error sending Email:", error)
    }

    
} 