# Fury Fight Club — Auth Service
`ffc-auth-service` is the service that handles every operations on the user of the Fury Fight Club project. 

It runs on port `4002` and is accessible at the following url: [http://localhost:4002](http://localhost:4002)


## 🏃‍♂️ Start the service

You can either run the service with docker or with node.

### With docker

```bash
docker-compose up
```

### With node

```bash
npm install
npm start:dev
```

## 📝 API documentation

The API documentation is available at the following url: [http://localhost:4002/swagger](http://localhost:4002/swagger)

## 🕸️ K8S deployment

Docker image: `mcamus9/ffc-auth-docker`


### Prerequistes
- Install kubectl with `brew install kubectl`
- Install Gcloud SDK with `brew cask install google-cloud-sdk`

### Deployment

Deploy the service with the following command:
```bash
kubectl apply -f k8s/deployment.yaml
```

### Expose the service
```bash
kubectl apply -f k8s/service.yaml
```

### Automatic deployment

The service is automatically deployed on the GCloud cluster when a new tag is pushed on the master branch.

## 🧪 Tests

The project is tested with Jest. To run the tests, run the following command:

```bash
npm run test
```

The project is tested on each commits and before the deployment on the GCloud cluster.