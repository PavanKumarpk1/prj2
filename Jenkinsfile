pipeline {
    agent any

    environment {
        GCP_PROJECT_ID   = 'project-0a90b5af-55e0-4752-866'
        GKE_CLUSTER_NAME = 'production-gke-cluster'
        GKE_ZONE         = 'us-east1-b'
        IMAGE_NAME       = 'my-test-app'
        TAG              = 'latest'
        
        // Dynamic Credentials Binding from Jenkins credentials vault
        DOCKER_CREDS     = credentials('dockerhub-creds') 
        GKE_KEY          = credentials('gke-deploy-key') 
        
        FULL_IMAGE_URL   = "${DOCKER_CREDS_USR}/${IMAGE_NAME}:${TAG}"
        HOME             = '/tmp'
    }

    stages {
        stage('Pull SCM Workspace') {
            steps {
                echo "Jenkins automatically clones repo branch into workspace workspace root."
                sh "ls -la"
            }
        }

        stage('Build & Tag Docker Image') {
            steps {
                sh "docker build -t ${FULL_IMAGE_URL} ."
            }
        }

        stage('Publish Image to Registry') {
            steps {
                sh "echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin"
                sh "docker push ${FULL_IMAGE_URL}"
            }
        }

        stage('Deploy to Kubernetes via Ingress') {
            steps {
                withEnv(['KUBERNETES_SERVICE_HOST=', 'KUBERNETES_SERVICE_PORT=']) {
                    sh """
                        gcloud auth activate-service-account --key-file=${GKE_KEY} --project=${GCP_PROJECT_ID}
                        gcloud container clusters get-credentials ${GKE_CLUSTER_NAME} --zone ${GKE_ZONE} --project=${GCP_PROJECT_ID}
                        kubectl apply -f k8s-deploy.yaml
                    """
                }
            }
        }

        stage('Validate Ingress Status') {
            steps {
                echo "Fetching external domain endpoints from Ingress..."
                sh "kubectl get ingress app-ingress"
            }
        }
    }

    post {
        always {
            sh "docker logout"
        }
    }
}
