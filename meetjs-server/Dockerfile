FROM golang:latest

ENV GO111MODULE=on

WORKDIR /app/src

COPY . /app

RUN go get -d -v ./...
RUN go install -v ./...

EXPOSE 9000

CMD ["src"]