import { db } from "@/firebase/admin"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function GET() {
    return Response.json({success: true, data:'THANK YOU!'},{ status: 200})
}

export async function POST(request: Request){
    try {
        const rawBody = await request.json();

        let dataToUse;
        if (rawBody?.message?.toolCalls?.[0]?.function?.arguments) {
            dataToUse = rawBody.message.toolCalls[0].function.arguments;
        } 
        else if (rawBody?.message?.toolWithToolCallList?.[0]?.toolCall?.function?.arguments) {
            dataToUse = rawBody.message.toolWithToolCallList[0].toolCall.function.arguments;
        }
        else {
            dataToUse = rawBody;
        }

        const { 
            role = "Software Engineer", 
            type = "Technical", 
            level = "Mid-Level", 
            techstack = "General", 
            amount = 3, 
            userid 
        } = dataToUse || {};

        // 3. Generate Questions using Gemini 2.5 Flash
        const {text: questions} = await generateText({
            model: google("gemini-2.5-flash"),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
        })

        const interview = {
            role, 
            type, 
            level,
            techstack: techstack ? techstack.split(",") : [],
            questions: JSON.parse(questions),
            userid: userid,
            finalized: true,
            createdAt: new Date().toISOString()
        }
        
        await db.collection("interviews").add(interview)
        return Response.json({success: true}, {status: 200})
        
    } catch (error) {
        console.error(error)
        return Response.json({success:false, error}, {status: 500})
    }
}