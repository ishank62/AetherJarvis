# Execute a sequence of actions
all: warming build linting security unittest cooling

# Pipeline sequence
## The warming step pre-warms the evironment with:
warming:
	@echo "Start the project building"
	npm i
	cd ../simple-ssr
	npm install

## This step builds applications and creates deliverable items
build:
	npm run build
	cd ../simple-ssr
	npm run build-all
	cd ..
	npm run cdk synth 
## This step checks the code base with linting tools
linting:
	npm run eslint
## This step checks the code base with security tools
security:
	cfn_nag_scan -i ./cdk.out -t .\*.template.json
## This step executes unit tests for the code base
unittest:
	npm run test
## This step cleans up the environment from the secret values
cooling:
	@echo "Finish the project building"

# Manual execution
## Cleanup the whole environment. Remove all temporary files
clean:
	git clean -xdf
## Deploy application to the Dev AWS account manually
## npm run cdk -- deploy Dev-*
deploy:
	npm run cdk -- deploy SSRApiStack
## Execute integration tests for verification
validate:
	./test/test_validate.sh

## Update NOTICE file
notice:
	npx generate-license-file --input package.json --output NOTICE --overwrite
