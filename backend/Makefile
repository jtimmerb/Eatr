image-br:
	@echo "building image"
	@docker build -t eatr-test -f Dockerfile .
	@echo "running image"
	@docker run -it --rm -p 8080:8080 eatr-test

	

	