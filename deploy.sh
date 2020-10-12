#!/bin/bash

EB_APP="personality-project-api"
STAGING_BRANCH="master"
PRODUCTION_BRANCH="production"

# Determine the environment to deploy to based on which branch this commit is on
NODE_ENV=''
# if [[ $TRAVIS_BRANCH == $STAGING_BRANCH ]]; then
#  NODE_ENV="staging"
if [[ $TRAVIS_BRANCH == $PRODUCTION_BRANCH ]]; then
  NODE_ENV="production"
else
  # Don't want to deploy if it's not one of the above branches
  echo "Not deploying"
  exit
fi

EB_ENV="$EB_APP-$NODE_ENV"
echo "Deploying to $EB_ENV"
echo "pip upgrade"
/usr/bin/python -m pip install --upgrade pip
echo "openssl upgrade"
sudo python -m easy_install --upgrade pyOpenSSL

pip install --user --upgrade awsebcli
echo "eb --version"
eb --version
#aws configure set aws_access_key_id $AWS_ACCESS_KEY
#aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
#aws configure set region ap-northeast-2

# Configure AWS credentials for Elastic Beanstalk
 mkdir -p ~/.aws
 echo '[profile eb-cli]' > ~/.aws/config
 echo "aws_access_key_id = $AWS_ACCESS_KEY_ID" >> ~/.aws/config
 echo "aws_secret_access_key = $AWS_SECRET_ACCESS_KEY" >> ~/.aws/config
 echo "eb status"
eb status

# Deploy application to the appropriate ElasticBeanstalk env
echo "eb deploy"
eb deploy $EB_ENV -v
rm ~/.aws/config