const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Make sure to adjust the path as needed
const { expect } = chai;

chai.use(chaiHttp);

describe('GET /restaurants/:n', () => {
it('should return an json object of n restaurants', async () => {
    const n = 5;

    const res = await chai.request(app).get(`/restaurants/${n}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.lengthOf(n);
    res.body.forEach(restaurant => {
    expect(restaurant).to.have.property('name');
    expect(restaurant).to.have.property('avgScore');
    });
});
});

