# /************************************************
#   Title: A script for generating many hashes by iterating on a nonce
#   Author: Antonopoulos, A
#   Date: 2017
#   Code version: 1.0.0
#   Availability: O'Reilly
# *************************************************

# example of iterating a nonce in a hashing algorithm's input

import hashlib

text = "I am Satoshi Nakamoto"

# iterate nonce from 0 to 19
for nonce in xrange(20):

    # add the nonce to the end of the test
    input = text + str(nonce)

    # calculate the SHA-256 hash of the input (text+nonce)
    hash = hashlib.sha256(input).hexdigest()

    # show the input and hash result
    print input, '=>', hash