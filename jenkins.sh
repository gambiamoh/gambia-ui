if [ $PRODUCTION == true ] && [ $TEST_PROD_COPY == true ]; then
  echo 'Both $PRODUCTION and $TEST_PROD_COPY cannot be set to true. Aborting.'
  exit 1
fi

if [ $PRODUCTION == true ]; then
  echo "building image for production instance"
  cp ./deployment-config/prod_env/settings.env .env
elif [ $TEST_PROD_COPY == true ]; then
  echo "building image for test production copy instance"
  cp ./deployment-config/uat_env/settings.env .env
else
  echo "building image for dev/test instance"
  cp ./deployment-config/dev_env/settings.env .env
fi

/usr/local/bin/docker-compose pull
/usr/local/bin/docker-compose down --volumes
/usr/local/bin/docker-compose run --entrypoint ./build.sh gambia-ui
/usr/local/bin/docker-compose build image
/usr/local/bin/docker-compose down --volumes

if [ $PRODUCTION == true ]; then
  echo "pushing image for production instance"
  docker tag openlmisgambia/ui:latest openlmisgambia/gambia-prod-ui:${version}
  docker push openlmisgambia/gambia-prod-ui:${version}
elif [ $TEST_PROD_COPY == true ]; then
  echo "pushing image for test production copy instance"
  docker tag openlmisgambia/ui:latest openlmisgambia/gambia-uat-ui:${version}
  docker push openlmisgambia/gambia-uat-ui:${version}
else
  echo "pushing image for dev/test instance"
  docker tag openlmisgambia/ui:latest openlmisgambia/ui:${version}
  docker push openlmisgambia/ui:${version}
fi

rm -Rf ./deployment-config
rm -f .env