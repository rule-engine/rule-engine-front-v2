<template>
    <div class="task-group">
        <div class="task-content">
            <draggable :options="dragOptions" @update="update" :id="conditionGroupId">
                <slot></slot>
            </draggable>
        </div>
    </div>
</template>

<script>
    import Draggable from 'vuedraggable'

    const dragOptions = {
        sort: true,
        scroll: true,
        scrollSpeed: 2,
        animation: 150,
        ghostClass: 'dragable-ghost',
        chosenClass: 'dragable-chose',
        dragClass: 'dragable-drag',
    };

    export default {
        name: 'TaskGroup',
        components: {Draggable},
        props: ['title', 'group', 'dataList', 'conditionGroupId'],
        data() {
            return {
                dragOptions: {...dragOptions, group: this.group}
            }
        },
        methods: {
            update(e) {
                let cgc = this.getConditionGroupById(e.from.id).conditionGroupCondition
                this.$emit("update", {
                    from: cgc[e.oldIndex],
                    to: cgc[e.newIndex],
                    cgc: cgc
                })
            },
            getConditionGroupById(id) {
                return this.dataList.find(e => e.id === parseInt(id))
            }
        },
        computed: {
            count() {
                return this.$slots.default.length
            }
        }
    }
</script>

<style lang="less">
    .task-group {
        width: 100%;
        //padding: 8px 8px;
        //background-color: @background-color-light;
        //border-radius: 6px;
        //border: 1px solid @shadow-color;

        .task-head {
            //margin-bottom: 8px;
            .title {
                display: inline-block;

                span {
                    display: inline-block;
                    border-radius: 10px;
                    margin: 0 8px;
                    font-size: 12px;
                    padding: 2px 6px;
                    background-color: @base-bg-color;
                }
            }

            .actions {
                display: inline-block;
                float: right;
                font-size: 18px;
                font-weight: bold;

                i {
                    cursor: pointer;
                }
            }
        }
    }

    .dragable-ghost {
        border: 1px dashed red;
        opacity: 1;
    }

    .dragable-chose {
        border: 1px dashed red;
        opacity: 0.8;
    }

    .dragable-drag {
        border: 1px dashed red;
        opacity: 1;
    }
</style>
