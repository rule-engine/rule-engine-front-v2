<template>
    <div class="task-group">
        <!--    <div class="task-head">-->
        <!--      <h3 class="title"><span v-if="count">{{count}}</span>{{title}}</h3>-->
        <!--      <div class="actions" style="float: right">-->
        <!--        <a-icon class="add" type="plus" draggable="true"/>-->
        <!--        <a-icon class="more" style="margin-left: 8px" type="ellipsis" />-->
        <!--      </div>-->
        <!--    </div>-->
        <div class="task-content">
            <draggable :options="dragOptions" @add="add" @update="update" :id="conditionGroupId">
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
        // onUpdate:
    }

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
            add(e) {
                let fromList = this.getConditionGroupById(e.from.id).conditionGroupCondition
                let toList = this.getConditionGroupById(e.to.id).conditionGroupCondition;
                let from = fromList[e.oldIndex]
                toList.push(from)
                fromList.splice(e.oldIndex, 1)
                this.$emit("update", {
                    from: from,
                    to: toList[e.newIndex],
                    fromConditionGroupId: e.from.id,
                    toConditionGroupId: e.to.id
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
