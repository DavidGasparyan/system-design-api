pipeline {
    agent any

    environment {

    }

    stages {

        stage('Clone repository') {
            steps {
                script{
                    checkout scm
                }
            }
        }

        stage('Build') {
            steps {
                script{
                    app = docker.build("underwater")
                }
            }
        }

        stage('Test'){
            steps {
                echo 'Empty'
            }
        }

        stage('Deploy') {
            steps {
                script{
                    docker.withRegistry('https://477321446363.dkr.ecr.us-east-1.amazonaws.com', 'ecr:us-east-1:aws-credentials') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }

    }
}