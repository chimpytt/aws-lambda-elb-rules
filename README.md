# aws-lambda-elb-rules
Update Application Load Balancer Rule Priority with Lambda

#### Setup
To use this code, create a new Lambda Function with the Nodejs 10 Runtime. The IAM Role supporting the function must be allowed to interact with both CodePipeline and Elastic Load Balancing v2.

Replace the "ELB-RULE-ONE-ARN-HERE" and "ELB-RULE-TWO-ARN-HERE" with the actual ARN's of the rules created when you deploy and application load balancer on AWS. Once updated, the function is ready to be called from CodePipeline using the AWS Lambda Invoke step.

Pass "Block" or "Allow" as user parameters to switch between the traffic flowing / or being blocked.

#### Usage
It is recommended to invoke this function early during pipeline execution to "block" traffic to your resources will you are updating the application/performing back ups/etc. Create a Rule that presents a fixed 503 response to requests ("We will be right back"). When pipeline activities are complete, invoke the same function to allow traffic back through the ELB.

![ELB Rules](https://github.com/chimpytt/aws-lambda-elb-rules/blob/master/elb_bitbucket.PNG)
