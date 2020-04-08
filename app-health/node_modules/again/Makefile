TESTS = $(shell ls -S `find test -type f -name "*.js" -print`)
TESTTIMEOUT = 15000
MOCHA_OPTS =
REPORTER = tap
JSCOVERAGE = ./node_modules/visionmedia-jscoverage/jscoverage

test:
	@$(NPM_INSTALL_TEST)
	@NODE_ENV=test node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) --timeout $(TESTTIMEOUT) $(MOCHA_OPTS) $(TESTS)

test-cov:
	@rm -rf lib-cov
	@$(JSCOVERAGE) lib lib-cov
	@ISERACH_COV=1 $(MAKE) test
	@ISERACH_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

.PHONY: test test-cov
