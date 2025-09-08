Allows users to track their attendance during a specific time frame, and admins to set said time frame

Originally created as a tool to track attendance for a school club, with the beginning of the time frame corresponding to the start of a club meeting, and the end being set a couple hours after the meeting ends. Designed to connect to an existing Google attendance form. The website mentions "fighting names" as the school club is LARP-related, and people in the club have "fighting names" that they go by, a type of nickname.

To run: 
1. Clone the repository
2. Create a .env file. Add a MongoDB connection URI, a Resend API key, and a Google client ID. The MongoDB URI should follow the format "mongodb+srv://<dbUser>:<dbPassword>@cluster0.<example>.mongodb.net/test?authMechanism=SCRAM-SHA-1"
To fully run the web application as intended, a MongoDB connection URI, a Resend API key, and a Google client ID are required. The application can technically be run with just a MongoDB connection URI, however a Resend API key and Google client ID are required to support user registration and sign in.
3. Run "Deno task start"

Admins can be manually added by modifying the "User" table on MongoDB.

Here are example videos of the application.


https://github.com/user-attachments/assets/ac7e4f8e-befa-46c4-9700-49815fcfca90



https://github.com/user-attachments/assets/d8e6ee55-9b0f-4003-b5c7-075bfec0668c



https://github.com/user-attachments/assets/dbd87b47-5cfb-4593-9a44-3031f50848a8



https://github.com/user-attachments/assets/a584a5ac-6f4b-4cab-84de-ddf367683a4b

