#MakeFile to build and deploy the Sample US CENSUS Name Data using ajax
# For CSC3004 Software Development

user = skon

all:  PutHTML


PutHTML:
	cp zork.html /var/www/html/class/softdev/$(user)/zork/
	cp zork.css /var/www/html/class/softdev/$(user)/zork/
	cp zork.js /var/www/html/class/softdev/$(user)/zork/
	cp zork.xml /var/www/html/class/softdev/$(user)/zork/
	echo "Current contents of your HTML directory: "
	ls -l /var/www/html/class/softdev/$(user)/zork/
