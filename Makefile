deploy-testing:
	npm run build:testing
	scp dist/index.html root@test.zhulogic.com:/usr/local/webapps/vue-fabric-dome/
deploy-stage:
	npm run build:stage
	scp dist/index.html root@test.zhulogic.com:/usr/local/webapps/stage-design/