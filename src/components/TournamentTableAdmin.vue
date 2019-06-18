<template>
    <div class="table-container">
        <v-data-table :headers="headers" :items="tournaments" hide-actions>
            <template slot="items" slot-scope="props">
                <td class="main-table-ele text-md-left" @click="selectRow(props.item)">
                    <a href="#"> {{ props.item.name }} </a>
                </td>
                <td class="text-md-left ">{{ props.item.description }}</td>
                <td class="text-md-left ">{{ props.item.status }}</td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        name: 'TournamentTable',
        data: function () {
            return {
                headers: [{
                        text: 'Torneo',
                        align: 'left',
                        value: 'name'
                    },
                    {
                        text: 'Evento',
                        value: 'description'
                    },
                    {
                        text: 'Status',
                        value: 'status'
                    },

                ],
                tournaments: []
            }
        },
        created: function () {
            let vm = this;
            vm.tournamentList().then(result => {
                let data = result.map(item => {
                    return {
                        name: item.name,
                        description: item.description,
                        status: item.status
                    }
                });
                vm.tournaments = data;
            })
        },
        methods: {
            ...mapActions([
                'tournamentList'
            ]),
            selectRow: function (item) {
                console.log(item);
            }

        }
    }
</script>
<style scoped>
    .main-table-ele,
    .main-table-ele a {
        text-decoration: none !important;
        font-weight: bold;
    }

    .table-container td {
        color: #777;
    }
</style>