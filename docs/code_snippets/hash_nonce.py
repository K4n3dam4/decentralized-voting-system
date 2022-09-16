# /************************************************
#   Based on
#   Title: Generating many hashes by iterating on a nonce
#   Author: Antonopoulos, A
#   Date: 2017
#   Code version: 1.0.0
#   Availability: O'Reilly
# *************************************************

import hashlib

input_value = "A nonce will be added to this value"

# iterate nonce from 0 to 19
for nonce in xrange(20):
    # add nonce to the input value
    input_with_nonce = input_value + str(nonce)

    # calculate the SHA-256 hash of the input value (input_value+nonce)
    hashed_value = hashlib.sha256(input_with_nonce).hexdigest()

    # print input value and hash result
    print input_with_nonce, '=>', hashed_value
