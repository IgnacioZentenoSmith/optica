# syntax=docker/dockerfile:1
FROM python:3.9.18
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /backend
RUN apt-get update && apt-get -y install libpq-dev gcc
RUN python -m pip install --upgrade pip
COPY requirements.txt /backend/
RUN pip install -r requirements.txt
COPY . /backend/