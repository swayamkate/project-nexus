#!/bin/bash
set -e

# Update lds.template.yaml with all convenient aliases
sudo python3 -c "
path = '/home/avishkar/supabase/docker/volumes/api/envoy/lds.template.yaml'
with open(path, 'r') as f:
    lines = f.readlines()

out = []
skip = False
for line in lines:
    if '- name: envoy.filters.http.basic_auth' in line:
        out.append(line)
        out.append(\"                  typed_config:\n\")
        out.append(\"                    '@type': >-\n\")
        out.append(\"                      type.googleapis.com/envoy.extensions.filters.http.basic_auth.v3.BasicAuth\n\")
        out.append(\"                    users:\n\")
        out.append(\"                      inline_string: |\n\")
        out.append(\"                        Avishkar:{SHA}nI2l+lXA2tfkxPEnOXCGzmqH4Ik=\n\")
        out.append(\"                        avishkar:{SHA}U+2D2sQwgzIQGb9trNTnV03iLk4=\n\")
        out.append(\"                        admin:{SHA}nI2l+lXA2tfkxPEnOXCGzmqH4Ik=\n\")
        out.append(\"                        superadmin:{SHA}vIoqlMewMhhN4Mi9R5rZmMrAb2Q=\n\")
        out.append(\"                        nexus:{SHA}vIoqlMewMhhN4Mi9R5rZmMrAb2Q=\n\n\")
        skip = True
    elif skip:
        if '# Copies ?apikey=... from the URL' in line:
            skip = False
            out.append(line)
    else:
        out.append(line)

with open(path, 'w') as f:
    f.writelines(out)
print('Successfully configured aliases for all password variations!')
"

# Restart api-gw (Envoy)
sudo -u avishkar bash -c 'cd /home/avishkar/supabase/docker && docker compose restart api-gw'
echo "ENVOY RESTARTED WITH ALL WORKING ALIASES!"
