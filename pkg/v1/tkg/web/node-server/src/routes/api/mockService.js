'use strict';

const paths = require('../../conf/paths');
const util = require(paths.src.util);
const express = require('express');
const appConfig = require(paths.src.appConfig);
const winston = require('winston');
const ENDPOINT = appConfig.apiEndpoint;

// path to json file based responses
let mockJsonResultsRes = util.readJsonFileSync(paths.json.mockJsonResults, 'utf8');
let mockvcNetworkRequestCounter = 0;
let mockResourcePoolRequestCounter = 0;
let mockOsImageRequestCounter = 0;
let mockDockerDaemonCounter = 0;

// eslint-disable-next-line new-cap
let router = express.Router({
    // '/Foo' different from '/foo'
    caseSensitive: true,
    // '/foo' and '/foo/' treated the same
    strict: false
});

/*
 * Mock route, for GET JSON file specific to design type
 */
router.get(`${ENDPOINT}/test/:urlparam`, (req, res) => {
    winston.info('Mock TKG UI GET API with URL param');
    res.status(200);
    res.json(mockJsonResultsRes);
});

/*
 * Mock route, for GET all JSON file
 */
router.get(`${ENDPOINT}/test`, (req, res) => {
    winston.info('Mock TKG UI GET API no URL param');
    res.status(200);
    res.json(mockJsonResultsRes);
});

/*
 * Mock route, for GET specified provider
 */
router.get(`${ENDPOINT}/providers`, (req, res) => {
    winston.info('Mock TKG UI GET PROVIDERS API');
    res.status(200);
    res.json({
        "provider": "docker-1.3.1",
        "tkrVersion": "v1.17"
    });
});

/*
 * Mock route, for GET feature flags
 */
router.get(`${ENDPOINT}/features`, (req, res) => {
    winston.info('Mock TKG UI GET FEATURES API');
    res.status(200);
    res.json({
        "global": {
            "dual-stack": "true",
            "ceip": "true"
        },
        "management-cluster": {
            "encrypt-credentials": "true",
            "export-from-confirm": "true",
            "import": "true",
            "vsphereIPv6": "true",
            "standalone-cluster-mode": "false",
        },
        "cluster": {
            "validateXyz": "true"
        }
    });
});

/*
 * Mock route, for GET edition
 */
router.get(`${ENDPOINT}/edition`, (req, res) => {
    winston.info('Mock TKG UI GET EDITION API: ' + appConfig.edition);
    res.status(200);
    res.json(appConfig.edition);
});

/**
 * Mock route for connect Avi controller
 */
router.post(`${ENDPOINT}/avi`, (req, res) => {
    winston.info('Mock TKG UI CONNECT AVI CONTROLLER API');
    if ((req.body.host === 'avi.local') &&
        (req.body.username === 'administrator' || req.body.username === 'admin') &&
        (req.body.password === 'password')) {
        res.status(200);
        res.json({});
    } else {
        res.status(403);
        res.json({ message: 'incorrect username or password' });
    }
});

/**
 * Mock route for getting Avi clouds
 */
router.get(`${ENDPOINT}/avi/clouds`, (req, res) => {
    winston.info('Mock TKG UI FETCH AVI CLOUDS');
    res.status(200);
    res.json([
        {
            uuid: '631ad1fe-40c5-11eb-b378-0242ac130002',
            name: 'Cloud-1',
            location: 'west'
        },
        {
            uuid: '77ab78e4-40c5-11eb-b378-0242ac130002',
            name: 'Cloud-1-S',
            location: 'south'
        },
        {
            uuid: '7ca583c6-40c5-11eb-b378-0242ac130002',
            name: 'Cloud-2',
            location: 'east'
        },
        {
            uuid: '8047129c-40c5-11eb-b378-0242ac130002',
            name: 'Cloud-3',
            location: 'emea'
        },
    ]);
});

/**
 * Mock route for getting Avi service engine groups
 */
router.get(`${ENDPOINT}/avi/serviceenginegroups`, (req, res) => {
    winston.info('Mock TKG UI FETCH AVI SERVICE ENGINE GROUPS');
    res.status(200);
    res.json([
        {
            uuid: 'b4454eba-40c5-11eb-b378-0242ac130002',
            name: 'Group-1',
            location: 'cloud-77ab78e4-40c5-11eb-b378-0242ac130002'
        },
        {
            uuid: 'b9f23350-40c5-11eb-b378-0242ac130002',
            name: 'Group-1',
            location: 'cloud-77ab78e4-40c5-11eb-b378-0242ac130002'
        },
        {
            uuid: 'be23eb08-40c5-11eb-b378-0242ac130002',
            name: 'Group-2',
            location: 'cloud-7ca583c6-40c5-11eb-b378-0242ac130002'
        },
        {
            uuid: 'c2b2a20e-40c5-11eb-b378-0242ac130002',
            name: 'Group-3',
            location: 'cloud-8047129c-40c5-11eb-b378-0242ac130002'
        },
    ]);
});

/**
 * Mock route for getting Avi service engine groups
 */
router.get(`${ENDPOINT}/avi/vipnetworks`, (req, res) => {
    winston.info('Mock TKG UI FETCH AVI VIP NETWORKS');
    res.status(200);
    res.json(
        [
            {
               "cloud":"631ad1fe-40c5-11eb-b378-0242ac130002",
               "configedSubnets":[
               ],
               "name":"VM Network",
               "uuid":"network-40-cloud-e08f75e2-a011-4cf9-a895-94c923243a9e"
            },
            {
               "cloud":"77ab78e4-40c5-11eb-b378-0242ac130002",
               "configedSubnets":[
                  {
                     "family":"V4",
                     "subnet":"192.168.1.0/24"
                  },
                  {
                     "family":"V4",
                     "subnet":"10.92.224.0/19"
                  },
                  {
                     "family":"V4",
                     "subnet":"10.1.2.0/24"
                  }
               ],
               "name":"faraway-network",
               "uuid":"network-28-cloud-372bac78-e960-422c-8da6-2413e4cf6b03"
            }
         ]
    );
});

/**
 * Mock route for connect VC server
 */
router.post(`${ENDPOINT}/providers/vsphere`, (req, res) => {
    winston.info('Mock TKG UI CONNECT VC API');
    if ((req.body.host === 'vsphere.local' || req.body.host === '1.1.1.1'
        || req.body.host === '2001:0db8:85a3:0000:0000:8a2e:0370:7334') &&
        (req.body.username === 'admin' || req.body.username === 'administrator') &&
        (req.body.password === 'password')) {
        res.status(200);
        res.json({
            "version": "6.7.0:14367737",
            "hasPacific": 'no',
            "tkrVersion": "v1.17"
        });
    } else {
        res.status(403);
        res.json({ message: 'incorrect username or password' });
    }
});

/**
 * Mock route for getting VC datacenter network
 */
router.get(`${ENDPOINT}/providers/vsphere/networks`, (req, res) => {
    winston.info('Mock TKG UI VC NETWORK API');

    let vcNetworksResponse = [
        {
            name: 'Network 1',
            id: 'network-1',
            displayName: 'Network 1'
        },
        {
            name: 'Network 2',
            id: 'network-2',
            displayName: 'Network 2'
        },
        {
            name: 'Network 3',
            id: 'network-3',
            displayName: 'Network 3'
        },
        {
            name: 'Network 4',
            id: 'network-4',
            displayName: 'Network 4'
        },
        {
            name: 'Network 5',
            id: 'network-5',
            displayName: 'Network 5'
        },
        {
            name: 'Network 6',
            id: 'network-6',
            displayName: 'Network 6'
        }
    ];

    if (mockvcNetworkRequestCounter > 0) {
        vcNetworksResponse.push({
            name: 'Network 7',
            id: 'network-7',
            displayName: 'Network 7'
        });
    }

    mockvcNetworkRequestCounter++;

    res.status(200);
    res.json(vcNetworksResponse);
});

/**
 * Mock route for thumbsprint
 */

router.get(`${ENDPOINT}/providers/vsphere/thumbprint`, (req, res) => {
    winston.info('Mock TKG UI FETCH THUMBPRINT');
    res.status(200);
    res.json(
        {
            thumbprint: 'DF:36:82:55:6A:27:4B:0C:35:3E:D8:EC:3A:DB:46:01:8E:6E:97:97',
            insecure: false
        }
    );
});

/**
 * Mock route for getting VC datacenters
 */
router.get(`${ENDPOINT}/providers/vsphere/datacenters`, (req, res) => {
    winston.info('Mock TKG UI FETCH DATACENTERS');
    res.status(200);
    res.json([
        {
            name: '/SDDC-Datacenter/test/dc-2',
            moid: 'test-dc-2'
        },
        {
            name: '/SDDC-Datacenter/dc-2',
            moid: 'dc-2'
        },
        {
            name: '/SDDC-Datacenter/dc-1',
            moid: 'dc-1'
        },

        {
            name: '/SDDC-Datacenter/test-a-really-long-one/dc-1',
            moid: 'test-dc-1'
        }
    ]);
});

/**
 * Mock route for getting datastores
 */
router.get(`${ENDPOINT}/providers/vsphere/datastores`, (req, res) => {
    winston.info('Mock TKG UI FETCH DATASTORES');
    res.status(200);
    res.json([
        {
            name: 'Datastore 1',
            moid: 'datastore-1'
        },
        {
            name: 'Datastore 2',
            moid: 'datastore-2'
        },
        {
            name: 'Datastore 3',
            moid: 'datastore-3'
        },
        {
            name: 'Datastore 4',
            moid: 'datastore-4'
        },
        {
            name: 'Datastore 5',
            moid: 'datastore-5'
        },
        {
            name: 'Datastore 6',
            moid: 'datastore-6'
        },
        {
            name: 'Datastore 7',
            moid: 'datastore-7'
        },
        {
            name: 'Datastore 8',
            moid: 'datastore-8'
        },
        {
            name: 'Datastore 9',
            moid: 'datastore-9'
        },
        {
            name: 'Datastore 10',
            moid: 'datastore-10'
        },
        {
            name: 'Datastore 11',
            moid: 'datastore-11'
        },
        {
            name: 'Datastore 12',
            moid: 'datastore-12'
        },
        {
            name: 'Datastore 13',
            moid: 'datastore-13'
        },
        {
            name: 'Datastore 14',
            moid: 'datastore-14'
        },
        {
            name: 'Datastore 15',
            moid: 'datastore-15'
        },
        {
            name: 'Datastore 16',
            moid: 'datastore-16'
        }
    ]);
});

/**
 * Mock route for getting vm folders
 */
router.get(`${ENDPOINT}/providers/vsphere/folders`, (req, res) => {
    winston.info('Mock TKG UI FETCH VM FOLDERS');
    res.status(200);
    if (req.body.dc === 'dc-1') {
        res.json([
            {
                name: 'Folder 1',
                moid: 'folder-1'
            },
            {
                name: 'Folder 2',
                moid: 'folder-2'
            },
            {
                name: 'Folder A1',
                moid: 'folder-a1'
            }
        ]);
    } else {
        res.json([
            {
                name: 'Folder 3',
                moid: 'folder-3'
            },
            {
                name: 'Folder 4',
                moid: 'folder-4'
            }
        ]);
    }
});

/**
 * Mock route for getting VC datacenters
 */
router.get(`${ENDPOINT}/providers/vsphere/resourcepools`, (req, res) => {
    winston.info('Mock TKG UI FETCH RESOURCE POOLS');

    let resourcePoolsResponse = [
        {
            name: 'Respool 1',
            moid: 'respool-1'
        },
        {
            name: 'Respool 2',
            moid: 'respool-2'
        },
        {
            name: 'Respool 3',
            moid: 'respool-3'
        }
    ];

    if (mockResourcePoolRequestCounter > 0) {
        resourcePoolsResponse.push({
            name: 'Respool 5',
            moid: 'respool-5'
        });
    }

    mockResourcePoolRequestCounter++;

    setTimeout(_ => {
        res.status(200);
        res.json(resourcePoolsResponse);
    }, 5000);
});

/**
 * Mock route for getting VC os images
 */
router.get(`${ENDPOINT}/providers/vsphere/osimages`, (req, res) => {
    winston.info('Mock TKG UI FETCH DATACENTERS (#' + mockOsImageRequestCounter + ')');
    let osImageResponse = [];
    if (mockOsImageRequestCounter > 0) {
        osImageResponse.push({
            name: 'Ubuntu Custom',
            moid: 'vm-3',
            isTemplate: true,
            osInfo: {
                arch: 'amd64',
                name: 'ubuntu',
                version: '20.04'
            }
        });

        osImageResponse.push({
            name: 'Ubuntu 1.18',
            moid: 'vm-4',
            isTemplate: false,
            osInfo: {
                arch: 'amd64',
                name: 'photon',
                version: '3'
            }
        });
    }

    mockOsImageRequestCounter++;

    res.status(200);
    res.json(osImageResponse);
});

router.post(`${ENDPOINT}/providers/vsphere/config/import`, (req, res) => {
    winston.info('Mock TKG UI IMPORT VC API');
    res.status(200);
    res.json({
        "annotations": {
            "description": "foo-description",
            "location": "bar-location"
        },
        "aviConfig": {
           "controlPlaneHaProvider" : "NSX Advanced Load Balancer",
            "network": {
               "name": "bozo-network"
            },
            "labels": {
                "foo1": "one",
                "foo2": "two"
            },
        },
        "ceipOptIn": true,
        "controlPlaneEndpoint": "10.92.12.54",
        "controlPlaneFlavor": "dev",
        "controlPlaneNodeType": "medium",
        "datacenter": "/SDDC-Datacenter/test/dc-2",
        "datastore": "Datastore 4",
        "folder": "Folder 4",
        "identityManagement": {
            "oidc_provider_name": "",
            "oidc_provider_url": "https://1.2.3.4",
            "oidc_client_id": "client-id",
            "oidc_client_secret": "client-secret",
            "oidc_scope": "scopes",
            "oidc_claim_mappings": {
                "username": "username-claim",
                "groups": "groups-claim"
            },
            "idm_type": "oidc"
        },
        "ipFamily": "ipv4",
        "labels": {
            "foo": "bar",
            "foo2": "bar2"
        },
        "machineHealthCheckEnabled": true,
        "networking": {"clusterPodCIDR": "100.96.0.0/11", "clusterServiceCIDR": "100.64.0.0/13", "networkName": "Network 3"},
        "os": {"isTemplate": false, "name": "Ubuntu Custom", "moid": "vm-3", "osInfo": {"arch": "amd64", "name": "photon", "version": "3"}},
        "resourcePool": "/cluster1-path/Resources/respool-1-path/sub-host-1-path",
        "ssh_key": "F8:DB:B3:6E:34:C6:0C:4D:15:8E:58:56:94:3D:32:4D:B6:85:BB:65",
        "workerNodeType": "medium",
        "vsphereCredentials": {
            "host": "vsphere.local",
            "password": "<encoded:cGFzc3dvcmQ=>",
            "thumbprint": "F8:DB:B3:6E:34:C6:0C:4D:15:8E:58:56:94:3D:32:4D:B6:85:BB:65",
            "username": "admin"
        }
    });
});

/**
 * Mock route for getting config file
 */
router.post(`${ENDPOINT}/providers/vsphere/config/export`, (req, res) => {
    winston.info('Mock TKG UI export config');
    res.status(200);    res.status(200);
    res.json("Pretend this is a beautiful config file");
});


/*** AWS releated APIs ***/

/**
 * Retrieve AWS account params from ENV variables
 */
router.get(`${ENDPOINT}/providers/aws`, (req, res) => {
    winston.info('Mock TKG UI FETCH AWS CREDENTIALS');

    const credentials = Math.random() > 0.2 ? {
        region: "US-WEST",
        accessKeyID: "aws-access-key-id-12345",
        secretAccessKey: "My-AWS-Secret-Access-Key",
        sshKeyName: "SSH-Key-Name"
    } : {};

    res.status(200);
    res.json(credentials);
});

/**
 * Verify AWS account credentials
 */
router.post(`${ENDPOINT}/providers/aws`, (req, res) => {
    winston.info('Mock TKG UI VERIFY AWS CREDENTIALS');
    res.status(201);
    res.json({});
});

/**
 * Retrieve AWS vpc's
 */
router.get(`${ENDPOINT}/providers/aws/vpc`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AWS VPCS');
    res.status(200);
    res.json([
        {
            id: 'vpc-1',
            cidr: '100.64.0.0/13'
        },
        {
            id: 'vpc-2',
            cidr: '100.84.0.0/12'
        }
    ]);
});

/**
 * Retrieve AWS availability zones
 */
router.get(`${ENDPOINT}/providers/aws/AvailabilityZones`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AWS AVAILABILITY ZONES');
    res.status(200);
    res.json([
        {
            id: 'us-west-a',
            name: 'us-west-a'
        },
        {
            id: 'us-west-b',
            name: 'us-west-b'
        },
        {
            id: 'us-west-c',
            name: 'us-west-c'
        }
    ]);
});

/**
 * Retrieve AWS VPC CIDRS
 */
router.get(`${ENDPOINT}/providers/aws/subnets`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AWS VPC SUBNET INFO');
    res.status(200);
    res.json([
        {
            availabilityZoneId: 'us-west-a',
            availabilityZoneName: 'us-west-a',
            cidr: '100.64.0.0/13',
            isPublic: true,
            id: 'sn1'
        },
        {
            availabilityZoneId: 'us-west-b',
            availabilityZoneName: 'us-west-b',
            cidr: '100.64.0.0/14',
            isPublic: true,
            id: 'sn2'
        },
        {
            availabilityZoneId: 'us-west-b',
            availabilityZoneName: 'us-west-b',
            cidr: '100.64.0.0/21',
            isPublic: false,
            id: 'sn3'
        },
        {
            availabilityZoneId: 'us-west-a',
            availabilityZoneName: 'us-west-a',
            cidr: '100.64.0.0/24',
            isPublic: false,
            id: 'sn4'
        },
        {
            availabilityZoneId: 'us-west-c',
            availabilityZoneName: 'us-west-c',
            cidr: '100.24.0.0/21',
            isPublic: false,
            id: 'sn5'
        },
        {
            availabilityZoneId: 'us-west-c',
            availabilityZoneName: 'us-west-c',
            cidr: '100.24.0.0/24',
            isPublic: true,
            id: 'sn6'
        }
    ]);
});

/**
 * Retrieve AWS node types
 */
router.get(`${ENDPOINT}/providers/aws/nodetypes`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AWS NODE TYPES');
    res.status(200);
    res.json([
        't3.small',
        't3.medium',
        't3.large',
        't3.xlarge',
        'm5.large',
        'm5.xlarge',
        'm5a.2xlarge',
        'm5a.4xlarge',
        'c6gn.small',
        'c6gn.medium',
        'c6gn.large',
        'r4.8xlarge',
        'i3.xlarge',
        't3.small',
        't3.medium',
        't3.large',
        't3.xlarge',
        'm5.large',
        'm5.xlarge',
        'm5a.2xlarge',
        'm5a.4xlarge',
        'r4.8xlarge',
        'i3.xlarge',
        't4g.small',
        't4g.medium',
        't4g.large'
    ]);
});

/**
 * Retrieve AWS regions
 */
router.get(`${ENDPOINT}/providers/aws/regions`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AWS REGIONS');
    res.status(200);
    res.json(['US-WEST', 'US-EAST', 'Singapore', 'China']);
});

/**
 * Retrieve AWS profiles
 */
router.get(`${ENDPOINT}/providers/aws/profiles`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AWS PROFILES');
    res.status(200);
    res.json(['profile1', 'profile2', 'profile3', 'profile4']);
});

/**
 * Retrieve os image
 */
router.get(`${ENDPOINT}/providers/aws/osimages`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AWS OS IMAGES');
    res.status(200);
    res.json([{
        name: 'amazon-2-amd64 (ami-0e6bac92abe2cbcf1)',
        osInfo: {
            arch: 'amd64',
            name: 'amazon',
            version: '2'
        }
    }, {
        name: 'ubuntu-20.04-amd64 (ami-0247eab6f03299f45)',
        osInfo: {
            arch: 'amd64',
            name: 'ubuntu',
            version: '20.04'
        }
    }]);
});

/**
 * Mock route for create aws cluster
 */
router.post(`${ENDPOINT}/providers/aws/create`, (req, res) => {
    winston.info('Mock TKG UI CREATE AWS CLUSTER');
    res.status(200);
    res.json({});
});

/**
 * Mock route for apply tkg config aws cluster
 */
router.post(`${ENDPOINT}/providers/aws/tkgconfig`, (req, res) => {
    winston.info('Mock TKG UI APPLY TKG CONFIG');
    res.status(200);
    res.json({
        path: "/path/to/config"
    });
});

/**
 * Mock route for getting config file
 */
router.post(`${ENDPOINT}/providers/aws/config/export`, (req, res) => {
    winston.info('Mock TKG UI export config');
    res.status(200);    res.status(200);
    res.json("Pretend this is a beautiful config file");
});

router.post(`${ENDPOINT}/providers/aws/config/import`, (req, res) => {
    winston.info('Mock TKG UI import config');
    res.status(200);
    res.json({
        "awsAccountParams": {
          "profileName": "profile1",
          "sessionToken": "",
          "region": "US-WEST",
          "accessKeyID": "",
          "secretAccessKey": ""
        },
        "loadbalancerSchemeInternal": false,
        "sshKeyName": "default",
        "createCloudFormationStack": true,
        "clusterName": "",
        "controlPlaneNodeType": "i3.xlarge",
        "controlPlaneFlavor": "prod",
        "bastionHostEnabled": true,
        "machineHealthCheckEnabled": true,
        "vpc": {
          "cidr": "10.0.0.0/16",
          "vpcID": "",
          "azs": [
            {
              "name": "us-west-a",
              "workerNodeType": "t3.small",
              "publicNodeCidr": "",
              "privateNodeCidr": "",
              "publicSubnetID": "",
              "privateSubnetID": ""
            },
            {
              "name": "us-west-b",
              "workerNodeType": "t3.xlarge",
              "publicNodeCidr": "",
              "privateNodeCidr": "",
              "publicSubnetID": "",
              "privateSubnetID": ""
            },
            {
              "name": "us-west-c",
              "workerNodeType": "m5a.2xlarge",
              "publicNodeCidr": "",
              "privateNodeCidr": "",
              "publicSubnetID": "",
              "privateSubnetID": ""
            }
          ]
        },
        "enableAuditLogging": false,
        "networking": {
          "networkName": "",
          "clusterDNSName": "",
          "clusterNodeCIDR": "",
          "clusterServiceCIDR": "100.64.0.0/13",
          "clusterPodCIDR": "100.96.0.0/11",
          "cniType": "antrea"
        },
        "ceipOptIn": true,
        "labels": {},
        "os": "1: Object",
        "annotations": {
          "description": "",
          "location": ""
        },
        "identityManagement": {
          "idm_type": "none"
        },
        "aviConfig": {
          "controller": "",
          "username": "",
          "password": "",
          "cloud": "",
          "service_engine": "",
          "ca_cert": "",
          "network": {
            "name": "",
            "cidr": ""
          },
          "labels": {}
        }
      });
});

/*** Azure related mock services ***/

/**
* Retrieve Azure account params from ENV variables
*/
router.get(`${ENDPOINT}/providers/azure`, (req, res) => {
    winston.info('Mock TKG UI FETCH AZURE CREDENTIALS');

    const credentials = {
        tenantId: "",
        clientId: "",
        clientSecret: "",
        subscriptionId: ""
    };

    res.status(200);
    res.json(credentials);
});

/**
 * Verify Azure account credentials
 */
router.post(`${ENDPOINT}/providers/azure`, (req, res) => {
    winston.info('Mock TKG UI VERIFY AZURE CREDENTIALS');
    if (req.body.tenantId && req.body.clientId && req.body.clientSecret && req.body.subscriptionId) {
        res.status(201);
        res.json({});
    } else {
        res.status(400);
        res.json({ message: "Incorrect credentials" });
    }
});

/**
* Retrieve Azure resource groups
*/
router.get(`${ENDPOINT}/providers/azure/resourcegroups`, (req, res) => {
    winston.info('Mock TKG UI FETCH AZURE RESOURCE GROUPS');

    const rgs = [
        {
            id: 1,
            location: "us-west",
            name: "resource-group1"
        },
        {
            id: 2,
            location: "us-east",
            name: "resource-group2"
        },
        {
            id: 3,
            location: "us-south",
            name: "resource-group3"
        }
    ];

    if (req.query.location) {
        res.status(200);
        res.json(rgs);
    } else {
        res.status(400);
        res.json({ message: "Missing resource group 'region'" });
    }
});

/**
 * Mock route for importing config file
 */
router.post(`${ENDPOINT}/providers/azure/config/import`, (req, res) => {
    winston.info('Mock TKG UI import config');
    res.status(200);    res.status(200);
    res.json({
        'azureAccountParams': {
            'tenantId': 'tenant-id',
            'clientId': 'client-id',
            'clientSecret': 'client-secret',
            'subscriptionId': 'subscription-id',
            'azureCloud': 'AzurePublicCloud'
        },
        'location': 'centralus',
        'sshPublicKey': 'ssh-pub-key',
        'controlPlaneMachineType': 'Standard_B2ms',
        'controlPlaneFlavor': 'dev',
        'workerMachineType': 'Standard_B2ms',
        'machineHealthCheckEnabled': true,
        'resourceGroup': 'resource-group3',
        'clusterName': 'poofta',
        'vnetResourceGroup': 'resource-group3',
        'vnetName': 'vnet2',
        'vnetCidr': '',
        'controlPlaneSubnet': 'subnet3',
        'workerNodeSubnet': '',
        'enableAuditLogging': true,
        "networking":{
            "networkName":"network-name",
            "clusterDNSName":"",
            "clusterNodeCIDR":"",
            "clusterServiceCIDR":"100.64.0.0/13",
            "clusterPodCIDR":"100.96.0.0/11",
            "cniType":"antrea",
            "httpProxyConfiguration":{
                "enabled":true,
                "HTTPProxyURL":"http://proxy-foo",
                "HTTPProxyUsername":"proxy-user-bar",
                "HTTPProxyPassword":"proxy-password-bar",
                "noProxy":"no-proxy",
                "HTTPSProxyURL":"http://proxy-foo",
                "HTTPSProxyUsername":"proxy-user-bar",
                "HTTPSProxyPassword":"proxy-password-bar"
            }
        },
        'ceipOptIn': false,
        'labels': {
            "foo":"bar",
            "goo":"gar"
        },
        'os': {
            'name': 'Ubuntu-20.04-amd64 (2021.04.13)',
            'osInfo': {
                'arch': 'amd64',
                'name': 'ubuntu',
                'version': '20.04'
            }
        },
        'annotations': {
            'description': 'optional-description-foo',
            'location': ''
        },
        "identityManagement": {
            "idm_type": "none",
            "ldap_group_search_name_attr": "cn",
            "ldap_group_search_user_attr": "DN",
            "ldap_user_search_username": "userPrincipalName",
            "oidc_claim_mappings": {
                "groups": "group-claim",
                "username": "username-claim"
            }
        },
        'aviConfig': {
            'controller': '',
            'username': '',
            'password': '',
            'cloud': '',
            'service_engine': '',
            'ca_cert': '',
            'network': {
                'name': '',
                'cidr': ''
            },
            'labels': {}
        },
        'isPrivateCluster': true,
        'frontendPrivateIp': '10.3.0.0'
    });
});

/**
 * Create an Azure resource group
 */
router.post(`${ENDPOINT}/providers/azure/resourcegroups`, (req, res) => {
    winston.info('Mock TKG UI CREATE AZURE RESOURCE GROUP');
    if (req.body.location && req.body.name) {
        res.status(201);
        res.json({});
    } else {
        res.status(400);
        res.json({ message: "Missing either resource group 'region' or 'name'" });
    }
});

/**
 * Retrieve Azure VNETS for a particular resource group
 */
router.get(`${ENDPOINT}/providers/azure/resourcegroups/:rgn/vnets`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AZURE VNETS');
    const vnets = [
        {
            id: 1,
            cidrBlock: ['10.1.0.0/11', '10.2.0.0/11'],
            location: 'us-west',
            name: "vnet1",
            subnets: [{ 'name': 'subnet1', 'cidr': '10.0.0.0/16' }, { 'name': 'subnet2', 'cidr': '16.5.0.0/24' }]
        },
        {
            id: 2,
            cidrBlock: ['10.3.0.0/11', '10.4.0.0/11'],
            location: 'us-west',
            name: "vnet2",
            subnets: [{ 'name': 'subnet3', 'cidr': '10.3.0.0/18' }, { 'name': 'subnet4', 'cidr': '10.4.0.0/22' }]
        },
        {
            id: 3,
            cidrBlock: ['10.5.0.0/11', '10.6.0.0/11', '10.7.0.0/11'],
            location: 'us-west',
            name: "vnet3",
            subnets: [{ 'name': 'subnet5', 'cidr': '10.5.0.0/16' }, { 'name': 'subnet7', 'cidr': '10.5.0.0/23' }, { 'name': 'subnet9', 'cidr': '10.5.233.0/23' }]
        }
    ];

    if (req.params.rgn) {
        res.status(200);
        res.json(vnets);
    } else {
        res.status(400);
        res.json({ message: "Missing either resource group name" });
    }
});

/**
 * Retrieve Azure regions
 */
router.get(`${ENDPOINT}/providers/azure/regions`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AZURE REGIONS');
    const regions = [
        {
            name: "westus",
            displayName: "West US"
        },
        {
            name: "northcentralus",
            displayName: "North central US"
        },
        {
            name: "southcentralus",
            displayName: "South central US"
        },
        {
            name: "centralus",
            displayName: "Central US"
        },
        {
            name: "eastus",
            displayName: "East US"
        },
        {
            name: "eastus2",
            displayName: "East US 2"
        }
    ];
    res.status(200);
    res.json(regions);
});

router.get(`${ENDPOINT}/providers/azure/regions/:location/instanceTypes`, (req, res) => {
    const output = [
        {
            name: "Standard_B1ls"
        },
        {
            name: "Standard_B1ms"
        },
        {
            name: "Standard_B1s"
        },
        {
            name: "Standard_B2ms"
        },
        {
            name: "Standard_B2s"
        },
        {
            name: "Standard_B4ms"
        },
        {
            name: "Standard_B8ms"
        },
        {
            name: "Standard_B12ms"
        },
        {
            name: "Standard_B16ms"
        },
        {
            name: "Standard_B20ms"
        },
    ];
    winston.info('Mock TKG UI RETRIEVE AZURE REGIONS');
    res.status(200);
    res.json(output);
});

/**
 * Retrieve os image
 */
 router.get(`${ENDPOINT}/providers/azure/osimages`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE AZURE OS IMAGES');
    res.status(200);
    res.json([{
        name: 'ubuntu-18.04-amd64 (2021.04.13)',
        osInfo: {
            arch: 'amd64',
            name: 'ubuntu',
            version: '18.04'
        }
    }, {
        name: 'Ubuntu-20.04-amd64 (2021.04.13)',
        osInfo: {
            arch: 'amd64',
            name: 'ubuntu',
            version: '20.04'
        }
    }]);
});

/**
 * Mock route for create Azure cluster
 */
router.post(`${ENDPOINT}/providers/azure/create`, (req, res) => {
    winston.info('Mock TKG UI CREATE AZURE CLUSTER');
    res.status(200);
    res.json({});
});

/**
 * Mock route for apply tkg config azure cluster
 */
router.post(`${ENDPOINT}/providers/azure/tkgconfig`, (req, res) => {
    winston.info('Mock TKG UI APPLY TKG CONFIG');
    res.status(200);
    res.json({
        path: "/path/to/config"
    });
});

/**
 * Mock route for getting config file
 */
router.post(`${ENDPOINT}/providers/azure/config/export`, (req, res) => {
    winston.info('Mock TKG UI export config');
    res.status(200);    res.status(200);
    res.json("Pretend this is a beautiful config file");
});

/*********************************   VSPHERE   **********************************/

/**
 * Mock route for apply tkg config vsphere cluster
 */
router.post(`${ENDPOINT}/providers/vsphere/tkgconfig`, (req, res) => {
    winston.info('Mock TKG UI APPLY TKG CONFIG');
    res.status(200);
    res.json({
        path: "/path/to/config"
    });
});

/**
 * Mock route for create vsphere cluster
 */
router.post(`${ENDPOINT}/providers/vsphere/create`, (req, res) => {
    winston.info('Mock TKG UI CREATE VSPHERE CLUSTER');
    res.status(200);
    res.json({});
});

/**
 * Retrieve compute resources
 */
router.get(`${ENDPOINT}/providers/vsphere/compute`, (req, res) => {
    winston.info('Mock TKG UI RETRIEVE COMPUTE RESOURCES');
    res.status(200);
    res.json([
        {
            moid: "dc1",
            name: "DC1",
            parentMoid: "",
            path: "",
            resourceType: "datacenter"
        },
        {
            moid: "cluster1",
            name: "Cluster 1",
            parentMoid: "dc1",
            path: "cluster1-path",
            resourceType: "cluster"
        },
        {
            moid: "respool-1",
            name: "respool-1",
            parentMoid: "cluster1",
            path: "/cluster1-path/Resources/respool-1-path",
            resourceType: "respool"
        },
        {
            moid: "respool-1-sub",
            name: "respool-1-sub",
            parentMoid: "respool-1",
            path: "/cluster1-path/Resources/respool-1-path/sub-host-1-path",
            resourceType: "respool"
        },
        {
            moid: "respool-2",
            name: "respool-2",
            parentMoid: "cluster1",
            path: "/cluster1-path/Resources/respool-2-path",
            resourceType: "respool"
        },
        {
            moid: "host-2",
            name: "Host-2",
            parentMoid: "dc1",
            path: "host-2-path",
            resourceType: "host"
        },
        {
            moid: "cluster2",
            name: "Cluster 2",
            parentMoid: "dc1",
            path: "cluster2-path",
            resourceType: "cluster"
        }
    ]);
});
/**
 * Import config
 */
router.post(`${ENDPOINT}/providers/vsphere/config/import`, (req, res) => {
    winston.info('Mock TKG UI IMPORT');
    res.status(200);
    res.json(
        {
            "ceipOptIn": true,
            "controlPlaneEndpoint": "10.92.12.54",
            "controlPlaneFlavor": "dev",
            "controlPlaneNodeType": "medium",
            "datacenter": "/dc0",
            "datastore": "/dc0/datastore/local-1",
            "folder": "/dc0/vm",
            "identityManagement": {
                "idm_type": "none",
                "ldap_group_search_name_attr": "cn",
                "ldap_group_search_user_attr": "DN",
                "ldap_user_search_username": "userPrincipalName",
                "oidc_claim_mappings": {"groups": "", "username": ""}
            },
            "ipFamily": "ipv4",
            "machineHealthCheckEnabled": true,
            "networking": {"clusterPodCIDR": "100.96.0.0/11", "clusterServiceCIDR": "100.64.0.0/13", "networkName": "/dc0/network/VM Network"},
            "os": {"isTemplate": null, "name": "GeeIDunno", "osInfo": {"arch": "amd64", "name": "photon", "version": "3"}},
            "resourcePool": "/dc0/host/cluster0/Resources",
            "ssh_key": "F8:DB:B3:6E:34:C6:0C:4D:15:8E:58:56:94:3D:32:4D:B6:85:BB:65",
            "vsphereCredentials": {
                "host": "10.92.13.72",
                "password": "<encoded:QWRtaW4hMjM=>",
                "thumbprint": "F8:DB:B3:6E:34:C6:0C:4D:15:8E:58:56:94:3D:32:4D:B6:85:BB:65",
                "username": "administrator@vsphere.local"
            }
        }
    );
});

/*********************************   DOCKER   **********************************/

router.get(`${ENDPOINT}/providers/docker/daemon`, (req, res) => {
    winston.info('Mock TKG UI VALIDATE DOCKER DAEMON');
    mockDockerDaemonCounter++;
    res.status(200);
    res.json(
        {
            status: mockDockerDaemonCounter > 1 ? true : false
        }
    );
});

/**
 * Mock route for create docker cluster
 */
 router.post(`${ENDPOINT}/providers/docker/create`, (req, res) => {
    winston.info('Mock TKG UI CREATE docker CLUSTER');
    res.status(200);
    res.json({});
});

/**
 * Mock route for apply tkg config docker cluster
 */
router.post(`${ENDPOINT}/providers/docker/tkgconfig`, (req, res) => {
    winston.info('Mock TKG UI APPLY TKG CONFIG');
    res.status(200);
    res.json({
        path: "/path/to/config"
    });
});

/**
 * Mock route for getting config file
 */
router.post(`${ENDPOINT}/providers/docker/config/export`, (req, res) => {
    winston.info('Mock TKG UI export config');
    res.status(200);    res.status(200);
    res.json("CLUSTER_CIDR: 100.96.0.0/11\n" +
        "CLUSTER_NAME: foobar-cluster\n" +
        "CLUSTER_PLAN: dev\n" +
        "ENABLE_MHC: \"false\"\n" +
        "IDENTITY_MANAGEMENT_TYPE: none\n" +
        "INFRASTRUCTURE_PROVIDER: docker\n" +
        "LDAP_BIND_DN: \"\"\n" +
        "LDAP_BIND_PASSWORD: \"\"\n" +
        "LDAP_GROUP_SEARCH_BASE_DN: \"\"\n" +
        "LDAP_GROUP_SEARCH_FILTER: \"\"\n" +
        "LDAP_GROUP_SEARCH_GROUP_ATTRIBUTE: \"\"\n" +
        "LDAP_GROUP_SEARCH_NAME_ATTRIBUTE: cn\n" +
        "LDAP_GROUP_SEARCH_USER_ATTRIBUTE: DN\n" +
        "LDAP_HOST: \"\"\n" +
        "LDAP_ROOT_CA_DATA_B64: \"\"\n" +
        "LDAP_USER_SEARCH_BASE_DN: \"\"\n" +
        "LDAP_USER_SEARCH_FILTER: \"\"\n" +
        "LDAP_USER_SEARCH_NAME_ATTRIBUTE: \"\"\n" +
        "LDAP_USER_SEARCH_USERNAME: userPrincipalName\n" +
        "OIDC_IDENTITY_PROVIDER_CLIENT_ID: \"\"\n" +
        "OIDC_IDENTITY_PROVIDER_CLIENT_SECRET: \"\"\n" +
        "OIDC_IDENTITY_PROVIDER_GROUPS_CLAIM: \"\"\n" +
        "OIDC_IDENTITY_PROVIDER_ISSUER_URL: \"\"\n" +
        "OIDC_IDENTITY_PROVIDER_NAME: \"\"\n" +
        "OIDC_IDENTITY_PROVIDER_SCOPES: \"\"\n" +
        "OIDC_IDENTITY_PROVIDER_USERNAME_CLAIM: \"\"\n" +
        "OS_ARCH: \"\"\n" +
        "OS_NAME: \"\"\n" +
        "OS_VERSION: \"\"\n" +
        "SERVICE_CIDR: 100.64.0.0/13\n" +
        "TKG_HTTP_PROXY: http://us3rname:passw0rd@foo/bar/path/\n" +
        "TKG_HTTP_PROXY_ENABLED: \"true\"\n" +
        "TKG_HTTPS_PROXY: http://namie:passwordie@foo/bar/another/path/\n" +
        "TKG_NO_PROXY: not-even-a-proxy");
});
/**
 * Import config
 */
router.post(`${ENDPOINT}/providers/docker/config/import`, (req, res) => {
    winston.info('Mock TKG UI IMPORT');
    res.status(200);
    res.json(
        {
            "ceipOptIn": false,
            "clusterName": "stand-alonie",
            "identityManagement": {
                "idm_type": "none",
                "ldap_group_search_name_attr": "cn",
                "ldap_group_search_user_attr": "DN",
                "ldap_user_search_username": "userPrincipalName",
                "oidc_claim_mappings": {
                    "groups": "group-claim",
                    "username": "username-claim"
                }
            },
            "networking": {
                "clusterPodCIDR": "100.96.0.0/11",
                "clusterServiceCIDR": "100.64.0.0/13",
                "httpProxyConfiguration": {
                    "HTTPProxyPassword": "foo-password",
                    "HTTPProxyURL": "httpproxyurl/",
                    "HTTPProxyUsername": "foo-username",
                    "HTTPSProxyPassword": "bar-password",
                    "HTTPSProxyURL": "httpsproxyish/path/foo",
                    "HTTPSProxyUsername": "bar-username",
                    "enabled": true,
                    "noProxy": "nyet-proxy"
                }
            }
        }
    );
});

/**
 * LDAP verification mock services
 */
router.post(`${ENDPOINT}/ldap/connect`, (req, res) => {
    winston.info('Mock TKG UI VERIFY LDAP CONNECTION');
    res.status(200);
});

router.post(`${ENDPOINT}/ldap/bind`, (req, res) => {
    winston.info('Mock TKG UI VERIFY LDAP BIND');
    res.status(200);
});

router.post(`${ENDPOINT}/ldap/users/search`, (req, res) => {
    winston.info('Mock TKG UI VERIFY LDAP USER SEARCH');
    res.status(200);
});

router.post(`${ENDPOINT}/ldap/groups/search`, (req, res) => {
    winston.info('Mock TKG UI VERIFY LDAP GROUP SEARCH');
    res.status(200);
});

router.post(`${ENDPOINT}/ldap/disconnect`, (req, res) => {
    winston.info('Mock TKG UI VERIFY LDAP DISCONNECT');
    res.status(200);
});

module.exports = router;
