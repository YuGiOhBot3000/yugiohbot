FROM amazonlinux:latest

ARG LIBS=/usr/lib64
ARG OUT=/root
ARG NODE_VERSION=14

# set up container
RUN yum -y update \
&& yum -y groupinstall "Development Tools" \
&& curl --silent --location https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash - \
&& yum install -y nodejs gcc-c++ cairo-devel libjpeg-turbo-devel pango-devel giflib-devel

# will be created and become working dir
WORKDIR $OUT/nodejs

RUN npm install canvas@next

# will be created and become working dir
WORKDIR $OUT/lib

# gather missing libraries
RUN cp $LIBS/libblkid.so.1 . \
&& cp $LIBS/libmount.so.1 . \
&& cp $LIBS/libuuid.so.1 . \
&& cp $LIBS/libfontconfig.so.1 . \
&& cp $LIBS/libpixman-1.so.0 .

WORKDIR $OUT/dist/lib

# copy prebuilt and missing libs
RUN cp -r $OUT/nodejs/node_modules/canvas/build/Release/. . \
&& cp -a $OUT/lib/. .