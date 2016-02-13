var gulpSettings = {
    "INFO": {
        "TITLE": "Angular 2 Quickstart",
        "KEYWORDS": "angular, angular2, ng2, quickstart",
        "DESCRIPTION": "Description..."
    },
    "FOLDERS": {
        "DIST": "dist",
        "SOURCES": {
            "CLIENT": "src_client",
            "SERVER": "src_server"
        },
        "CLIENT": {
            "ROOT": "public",
            "CONTENT": {
                "APP": "app",
                "VENDOR": "vendor",
                "STYLES": "resources/styles",
                "IMAGES": "resources/images"
            }
        },
        "SERVER": {
            "API_BASE_PATH": "api",
            "REQUESTS_LOGS": "_logs_requests",
            "ACTIVITY_LOGS": "_logs_activity"
        }
    },
    "PRODUCTION": false,
    "PORT": {
        "PRODUCTION": 80,
        "DEVELOPMENT": 8888
    },
    "LOGS": {
        "REQUESTS_LOGS_ENABLED": true,
        "REQUESTS_FORMAT": 'combined',
        "REQUESTS_ONLY_ERRORS": true,
        "ACTIVITY_LOGS_ENABLED": true,
        "ACTIVITY_MAX_SIZE_MB": 1,
        "ACTIVITY_MAX_FILES": 10,
        "ACTIVITY_JSON_FORMAT": false
    },
    "UTILITIES": {
        "JQUERY": true,
        "LODASH": true,
        "MOMENT": true,
        "MOMENT_WITH_LOCALES": true
    }
};

module.exports = gulpSettings;