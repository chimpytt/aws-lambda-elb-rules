const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    
    var blockTrafficRulePriority = 1;
    var trafficToApplicationPriority = 2;
    
    const elbv2 = new AWS.ELBv2({apiVersion: '2015-12-01'});
    
    var codepipeline = new AWS.CodePipeline();
    
    // Retrieve the Job ID from the Lambda action
    var jobId = event["CodePipeline.job"].id;
    
    // Get traffic flow pattern
    var allow = event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;
    if(allow === "allow"){
        blockTrafficRulePriority = 2;
        trafficToApplicationPriority = 1;
    }
    
    // Notify AWS CodePipeline of a successful job
    var putJobSuccess = function(message) {
        var params = {
            jobId: jobId
        };
        codepipeline.putJobSuccessResult(params, function(err, data) {
            if(err) {
                context.fail(err);      
            } else {
                context.succeed(message);      
            }
        });
    };
    
    // Notify AWS CodePipeline of a failed job
    var putJobFailure = function(message) {
        var params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(message),
                type: 'JobFailed',
                externalExecutionId: context.invokeid
            }
        };
        codepipeline.putJobFailureResult(params, function(err, data) {
            context.fail(message);      
        });
    };
    
    var params = {
      RulePriorities: [
         {
        Priority: blockTrafficRulePriority, 
        RuleArn: "ELB-RULE-ONE-ARN-HERE"
       },{
        Priority: trafficToApplicationPriority, 
        RuleArn: "ELB-RULE-TWO-ARN-HERE"
       }
      ]
     };
    
    try {
        
         elbv2.setRulePriorities(params, function (err, data) {

              if (err){
                  console.log(err, err.stack); // an error occurred
                  callback(err);
                  putJobFailure("CodePipeline Failed - Unable to update ELB Rule Priority");
              } 
              else {
                  console.log(data);           // successful response
                  callback(null, data);
                  putJobSuccess("ELB Rule Priority Update Complete");
              }   
        });
        
    } catch (e){
        console.log(e);
        putJobFailure("CodePipeline Failed - Unable to update ELB Rule Priority");
    }
 
};
