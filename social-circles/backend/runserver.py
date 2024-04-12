'''import sys
import os
import argparse
import social_circles

PORT = int(os.environ.get('PORT', 5000))'''

import flask
import sys
import argparse
import social_circles

PORT = 5000

def main():
    try:
        social_circles.app.run(host = '0.0.0.0', port = PORT,
                               ssl_context = ('cert.pem', 'key.pem'))
    except Exception as ex:
        print(f'{sys.argv[0]}: {str(ex)}')
        sys.exit(1)
        
if __name__ == '__main__':
    main()
