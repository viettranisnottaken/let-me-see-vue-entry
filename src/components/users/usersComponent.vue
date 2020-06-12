<template>
  <div class="d-flex justify-content-center">
    <div class="row mx-3">
      <div class="col-12 d-flex justify-content-between">
        <div class="w-25">
          <b-form-input
            :type="'number'"
            placeholder="Items per page"
            paramName="per"
            @keyup="onKeyUp"
          ></b-form-input>
        </div>
        <div class="w-40 d-flex">
          <div>
            <div>
              <b-form-input
                class="mb-2"
                :type="'text'"
                placeholder="Search by name"
                paramName="user_name"
                @keyup="onKeyUp"
              ></b-form-input>
            </div>
            <div
              :class="{
                'd-block': isAdvancedSearch,
                'd-none': !isAdvancedSearch,
              }"
            >
              <b-form-input
                class="mb-2"
                :type="'text'"
                placeholder="Search by school name"
                paramName="school_name"
                @keyup="onKeyUp"
              ></b-form-input>
            </div>
            <div>
              <div>
                <b-form-select
                  :class="{
                    'd-block': isAdvancedSearch,
                    'd-none': !isAdvancedSearch,
                  }"
                  class="mb-2"
                  :options="genders"
                  placeholder="Select a gender"
                  @change="onGenderSelect"
                  v-model="genderSearchSelected"
                ></b-form-select>
              </div>
              <div
                :class="{
                  'd-block': isAdvancedSearch,
                  'd-none': !isAdvancedSearch,
                }"
              >
                <b-form-datepicker
                  class="mb-2"
                  v-model="fromValue"
                  @context="onFromSelect"
                  paramName="from"
                  placeholder="Find birthdate from"
                ></b-form-datepicker>
              </div>
              <div
                :class="{
                  'd-block': isAdvancedSearch,
                  'd-none': !isAdvancedSearch,
                }"
              >
                <b-form-datepicker
                  class="mb-2"
                  v-model="toValue"
                  @context="onToSelect"
                  paramName="to"
                  placeholder="Find birthdate to"
                ></b-form-datepicker>
              </div>
            </div>
          </div>
          <div>
            <b-button class="mx-2" variant="outline-primary" @click="toggleAdvancedSearch">Advanced</b-button>
            <b-button class="mx-2" variant="outline-danger" @click="resetSearchParams">Clear</b-button>
          </div>
        </div>
      </div>
      <div class="col-12 m-0 d-flex justify-content-start">
        <b-button variant="success" @click="onNewUser">New User</b-button>
      </div>
      <div class="col-12">
        <b-table-simple id="users-table" class="my-4" sticky-header="60vh" responsive>
          <b-thead>
            <b-tr>
              <b-th>No.</b-th>
              <b-th>Name</b-th>
              <b-th>Gender</b-th>
              <b-th>Birthdate</b-th>
              <b-th>School</b-th>
              <b-th></b-th>
              <b-th></b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="user in users" :key="user.id">
              <b-td>{{ users.indexOf(user) + 1 }}</b-td>
              <b-td>{{ user.name }}</b-td>
              <b-td>{{ genders[user.gender].text }}</b-td>
              <b-td>{{ user.birthdate }}</b-td>
              <b-td>{{ user.school_name }}</b-td>
              <b-td>
                <b-button variant="success" @click="onEditUser(user)">Edit</b-button>
              </b-td>
              <b-td>
                <b-button variant="danger" @click="onDeleteUser(user.id)">Delete</b-button>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <b-pagination
          v-model="currentPage"
          :total-rows="params.per * totalPages"
          :per-page="params.per"
          @input="onPageSwitch"
          aria-controls="users-table"
        ></b-pagination>
      </div>
    </div>
    <b-modal v-model="modalShow" hide-footer title="modalTitle">
      <b-form @submit="onSubmit">
        <b-form-group id="input-group-1" label="Name:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="formValues.user.name"
            type="text"
            required
            placeholder="Enter user's name"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Date of birth:" label-for="input-3">
          <b-form-datepicker
            id="input-2"
            v-model="formValues.user.birthdate"
            @context="onToSelect"
            paramName="to"
            placeholder="Pick a date"
          ></b-form-datepicker>
        </b-form-group>

        <b-form-group id="input-group-3" label="Genders:" label-for="input-3">
          <b-form-select id="input-3" v-model="formValues.user.gender" :options="genders" required></b-form-select>
        </b-form-group>

        <b-form-group id="input-group-4" label="Schools:" label-for="input-3">
          <b-form-select
            id="input-4"
            v-model="formValues.user.school_id"
            :options="schools"
            required
          ></b-form-select>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { delay } from '@/helpers/index.js';

export default {
  data: function() {
    return {
      isAdvancedSearch: false,
      genderSearchSelected: null,
      fromValue: null,
      toValue: null,
      modalShow: false,
      currentPage: 1,
      form: {
        user: {
          id: null,
          name: '',
          gender: null,
          birthdate: null,
          school_id: null,
        },
      },
      show: true,
      formPurpose: 'new',
    };
  },

  created: function() {
    this.fetchAllUsers(this.params);
  },

  computed: {
    ...mapState({
      users: state => state.user.users,
      params: state => state.user.params,
      totalPages: state => state.user.totalPages,
    }),
    ...mapGetters({
      genders: 'gendersForForms',
      schools: 'schoolsForForms',
    }),
    tableRowNo: function(index) {
      return index;
    },

    formValues: {
      get: function() {
        return this.form;
      },

      set: function(params) {
        let newForm = {
          user: {
            id: null,
            name: '',
            gender: null,
            birthdate: null,
            school_id: null,
          },
        };
        let editForm = {
          user: {
            id: params.id,
            name: params.name,
            gender: params.gender,
            birthdate: params.birthdate,
            school_id: params.school_id,
          },
        };

        this.form = this.formPurpose === 'edit' ? editForm : newForm;
      },
    },
  },

  methods: {
    ...mapActions(['fetchAllUsers', 'createUser', 'updateUser', 'deleteUser']),

    onSelectOption: function(event) {
      let optionInput = document.getElementById('option-input');

      optionInput.attributes.paramName = event.target.attributes.paramName;
      console.log(optionInput);

      this.$set(this, 'selectedOption', event.target.innerHTML);
    },

    ...mapMutations(['storeParams', 'resetSearchParams']),

    onKeyUp: delay(function(event) {
      let params = {};
      params[event.target.attributes.paramName.nodeValue] = event.target.value;
      this.fetchUsers(params);
    }, 500),

    toggleAdvancedSearch: function() {
      this.isAdvancedSearch = !this.isAdvancedSearch;
    },

    onGenderSelect: function() {
      this.fetchUsers({ gender: this.genderSearchSelected });
    },

    onFromSelect: function() {
      this.fetchUsers({ from: this.fromValue });
    },

    onToSelect: function() {
      this.fetchUsers({ to: this.toValue });
    },

    onNewUser: function() {
      this.formPurpose = 'new';
      this.formValues = this.form;
      this.modalShow = !this.modalShow;
    },

    onEditUser: function(user) {
      this.formPurpose = 'edit';
      this.formValues = user;
      this.modalShow = !this.modalShow;
    },

    onSubmit: async function(event) {
      event.preventDefault();
      let request = JSON.stringify(this.form);
      console.log(request);

      if (this.formPurpose === 'new') {
        this.createUser(request);
      } else {
        this.updateUser(request);
      }
      this.modalShow = false;
    },

    onDeleteUser: async function(id) {
      alert('Are you sure?');
      this.deleteUser({ params: { id } });
    },

    onPageSwitch: function() {
      this.fetchUsers({ page: this.currentPage });
    },

    resetSearchParams: function() {
      this.resetSearchParams();
      this.fetchUsers({ page: this.currentPage, per: this.params.per });
    },

    fetchUsers: function(params) {
      this.storeParams(params);
      this.fetchAllUsers(this.params);
    },
  },

  name: 'AppUsers',
};
</script>
