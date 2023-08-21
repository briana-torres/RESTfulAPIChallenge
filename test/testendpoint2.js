const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('PUT /restaurants/:name', () => {
    it('should update the most recent grade of a restaurant', async () => {
        const restaurantName = 'Isle of Capri Restaurant';
        const newGrade = 'B';

        const updateRes = await chai
            .request(app)
            .put(`/restaurants/${restaurantName}`)
            .send({ grade: newGrade });

        expect(updateRes).to.have.status(200);
        expect(updateRes.body.name).to.equal(restaurantName);

        const updatedRestaurant = updateRes.body;
        const updatedGrade = updatedRestaurant.grades[updatedRestaurant.grades.length - 1];
        expect(updatedGrade.grade).to.equal(newGrade);

        const fetchRes = await chai.request(app).get(`/restaurants/${restaurantName}`);
        const fetchedRestaurant = fetchRes.body;

        expect(fetchedRestaurant.name).to.equal(restaurantName);
        expect(fetchedRestaurant.grades[fetchedRestaurant.grades.length - 1].grade).to.equal(newGrade);
    });
});
