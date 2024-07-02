
# Amazon Connect Global Resiliency APIs demo

This demo shows how you can leverage [Amazon Connect](https://aws.amazon.com/connect/) Global Resiliency APIs and manage Traffic Distribution Groups(TDG), Claim a phone number to a TDG, Percentage allocate traffic between 2 regions etc.  

## Usage
Use `sam` to build, invoke and deploy the function.

##### SAM Build:
Ensure you are in the root folder

`sam build --use-container`

##### SAM Deploy:

Create a s3 bucket for hosting the CloudFormation template created by SAM and make a note of it. This will be used as value of the input parameter "--s3-bucket".

Update the below command with appropriate CloudFormation stack name and valid unique s3 bucket name in the "ParameterValue".

`sam deploy template.yaml --s3-bucket s3-BUCKET-NAME-FOR-CLOUDFORMATION-TEMPLATE --stack-name CLOUDFORMATION-STACK-NAME --parameter-overrides ParameterKey=parS3BucketForWebSite,ParameterValue=s3-BUCKET-NAME-FOR-WEBSITE-HOSTING --capabilities CAPABILITY_IAM`
      
